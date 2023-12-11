import { v4 as uuidv4 } from 'uuid';

import { ConfigService } from '@nestjs/config';

import { MYSTIFLY_TARGET } from '../config/config.constant';
import { CabinClass } from '../pricings/flights/cabin-class.enum';
import { PriceMargin } from '../pricings/flights/price-margin.enum';
import { AggregatesService } from '../providers/aggregates/aggregates.service';
import { AirlineDetails } from '../providers/aggregates/dtos/response/airline-auto-search-response.dto';
import { AirportDetails } from '../providers/aggregates/dtos/response/airport-auto-search-response.dto';
import {
  MystiflySearchFlightsRequestDto,
  OriginDestinationInformationsDto,
} from '../providers/mystifly/flight-utils/dtos/request/mystifly-search-flights-request.dto';
import { MystiflyRevalidationResponseDto } from '../providers/mystifly/flight-utils/dtos/response/mystifly-revalidation-response.dto';
import { MystiflySearchResponseDto } from '../providers/mystifly/flight-utils/dtos/response/mystifly-search-response.dto';
import { MystiflyFlightUtilsService } from '../providers/mystifly/flight-utils/mystifly-flight-utils.service';
import { OneWaySearchFlightsRequestDto } from './one-way/dtos/request/one-way-search-flights-request.dto';
import { MystiflySearch } from './one-way/dtos/response/one-way-search-flights-response.dto';
import { RoundtripSearchFlightsRequestDto } from './roundtrip/dtos/request/roundtrip-search-flights-request.dto';

const passengersCode = {
  adults: 'ADT',
  children: 'CHD',
  infants: 'INF',
};

const cabinPreference = {
  economy: 'Y',
  business: 'C',
  first: 'F',
  premium: 'S',
};

const preferredClasses = ['economy', 'business', 'first', 'premium'];

type PricingsType = {
  [x: string]: {
    [y: string]: Pick<
      Pick<
        {
          fixedAmount: number;
          percentage: number;
          cabinClass: CabinClass;
          iataCode: string;
          priceMargin: PriceMargin;
        },
        'iataCode' | 'fixedAmount' | 'percentage' | 'priceMargin'
      >,
      'fixedAmount' | 'percentage' | 'priceMargin'
    >;
  };
};

export class FlightsUtil {
  private readonly pagination = '999';

  constructor(
    private readonly aggregatesServiceUtil: AggregatesService,
    private readonly configServiceUtil: ConfigService,
    private readonly mystiflyFlightUtilsServiceUtil: MystiflyFlightUtilsService,
  ) {}

  protected async mapMystiflySearchResultsWithAirportAndAirlineAutoSearch(
    mystifly: MystiflySearchResponseDto,
  ): Promise<MystiflySearch[]> {
    const airportCodes: string[] = [];
    const airlineCodes: string[] = [];
    mystifly.Data.forEach((mystiflyData) => {
      mystiflyData.OriginDestinations.forEach((originDestination) => {
        const {
          DepartureAirportLocationCode,
          ArrivalAirportLocationCode,
          OperatingCarrierCode,
        } = originDestination.FlightSegment;
        if (!airportCodes.includes(ArrivalAirportLocationCode))
          airportCodes.push(ArrivalAirportLocationCode);
        if (!airportCodes.includes(DepartureAirportLocationCode))
          airportCodes.push(DepartureAirportLocationCode);
        if (!airlineCodes.includes(OperatingCarrierCode))
          airlineCodes.push(OperatingCarrierCode);
      });
    });

    const associatedAirportDetailsBuffer = await Promise.all(
      airportCodes.map((airportCode) =>
        this.aggregatesServiceUtil.airportAutoSearch({
          keyword: airportCode,
          pagination: this.pagination,
        }),
      ),
    );
    const associatedAirlineDetailsBuffer = await Promise.all(
      airlineCodes.map((airlineCode) =>
        this.aggregatesServiceUtil.airlineAutoSearch({
          keyword: airlineCode,
          pagination: this.pagination,
        }),
      ),
    );
    const associatedAirportDetails: AirportDetails[] = [];
    associatedAirportDetailsBuffer.forEach((airportDetail) => {
      associatedAirportDetails.push(...airportDetail.tag);
    });

    const associatedAirlineDetails: AirlineDetails[] = [];
    associatedAirlineDetailsBuffer.forEach((airlineDetail) => {
      associatedAirlineDetails.push(...airlineDetail.tag);
    });
    return await Promise.all(
      mystifly.Data.map(async (mystiflyData) => {
        const newOriginDestinations = await Promise.all(
          mystiflyData.OriginDestinations.map(async (originDestination) => {
            const {
              DepartureAirportLocationCode,
              ArrivalAirportLocationCode,
              OperatingCarrierCode,
            } = originDestination.FlightSegment;
            const [
              DepartureLocationDetails,
              ArrivalLocationDetails,
              OperatingCarrierDetails,
            ] = [
              associatedAirportDetails.find((data) => {
                if (data.airportCode === DepartureAirportLocationCode)
                  return data;
              }),
              associatedAirportDetails.find((data) => {
                if (data.airportCode === ArrivalAirportLocationCode)
                  return data;
              }),
              associatedAirlineDetails.find((data) => {
                if (data.code === OperatingCarrierCode) return data;
              }),
            ];
            if (DepartureLocationDetails) delete DepartureLocationDetails._id;
            if (ArrivalLocationDetails) delete ArrivalLocationDetails._id;
            if (OperatingCarrierDetails) delete OperatingCarrierDetails._id;
            const newFlightSegment = {
              ...originDestination.FlightSegment,
              DepartureLocationDetails,
              ArrivalLocationDetails,
              OperatingCarrierDetails,
            };
            return { ...originDestination, FlightSegment: newFlightSegment };
          }),
        );
        return { ...mystiflyData, OriginDestinations: newOriginDestinations };
      }),
    );
  }

  protected parseMystiflyFlightsSearchRequest(
    searchFlightsRequestDto:
      | OneWaySearchFlightsRequestDto
      | RoundtripSearchFlightsRequestDto,
    preferredClass: string,
    conversationId: string,
  ) {
    const { departureDate, originCode, destinationCode, passengers } =
      searchFlightsRequestDto;

    const passengerTypeQuantities: Array<{ Code: string; Quantity: number }> =
      [];
    for (const passenger in passengers) {
      if (passengers[passenger] !== 0)
        passengerTypeQuantities.push({
          Code: passengersCode[passenger],
          Quantity: passengers[passenger],
        });
    }

    let airTripType = 'OneWay';
    const originDestinationInformations: OriginDestinationInformationsDto[] = [
      {
        DepartureDateTime: departureDate,
        OriginLocationCode: originCode,
        DestinationLocationCode: destinationCode,
      },
    ];
    if (searchFlightsRequestDto instanceof RoundtripSearchFlightsRequestDto) {
      airTripType = 'Return';
      originDestinationInformations.push({
        DepartureDateTime: searchFlightsRequestDto.returnDate,
        OriginLocationCode: destinationCode,
        DestinationLocationCode: originCode,
      });
    }

    const mystiflySearchFlightsRequestDto: MystiflySearchFlightsRequestDto = {
      OriginDestinationInformations: originDestinationInformations,
      PassengerTypeQuantities: passengerTypeQuantities,
      TravelPreferences: {
        MaxStopsQuantity: 'All',
        CabinPreference: cabinPreference[preferredClass],
        Preferences: {
          CabinClassPreference: {
            CabinType: cabinPreference[preferredClass],
            PreferenceLevel: 'Restricted',
          },
        },
        AirTripType: airTripType,
      },
      PricingSourceType: 'All',
      IsRefundable: true,
      RequestOptions: 'Fifty',
      Nationality: '',
      Target: this.configServiceUtil.get(MYSTIFLY_TARGET),
      ConversationId: conversationId ?? uuidv4(),
    };

    return mystiflySearchFlightsRequestDto;
  }

  protected async mystiflySearchOneWay(
    oneWaySearchFlightsRequestDto: OneWaySearchFlightsRequestDto,
    pricings: PricingsType,
  ) {
    const conversationId = String(uuidv4());
    const mystiflySearchFlightsRequestDtos = await Promise.all(
      preferredClasses.map((preferredClass) =>
        this.parseMystiflyFlightsSearchRequest(
          oneWaySearchFlightsRequestDto,
          preferredClass,
          conversationId,
        ),
      ),
    );

    const mystifly = await Promise.all(
      mystiflySearchFlightsRequestDtos.map((mystiflySearchFlightsRequestDto) =>
        this.mystiflyFlightUtilsServiceUtil.search(
          mystiflySearchFlightsRequestDto,
        ),
      ),
    );

    const mystiflyResultsWithMappedAirportDetails = await Promise.all(
      mystifly.map((mystifly) =>
        this.mapMystiflySearchResultsWithAirportAndAirlineAutoSearch(mystifly),
      ),
    );

    const mystiflyData = {
      economy: mystiflyResultsWithMappedAirportDetails[0],
      business: mystiflyResultsWithMappedAirportDetails[1],
      first: mystiflyResultsWithMappedAirportDetails[2],
      premiumEconomy: mystiflyResultsWithMappedAirportDetails[3],
    };

    const mystiflyDataWithPricing = this.setMystiflyPricing(
      mystiflyData,
      pricings,
    );

    return { mystiflyData: mystiflyDataWithPricing, conversationId };
  }

  protected async mystiflySearchRoundtrip(
    roundtripSearchFlightsRequestDto: RoundtripSearchFlightsRequestDto,
    pricings: PricingsType,
  ) {
    const {
      departureDate,
      destinationCode,
      originCode,
      passengers,
      returnDate,
    } = roundtripSearchFlightsRequestDto;

    const ConversationIdDepart = uuidv4();
    const ConversationIdReturn = uuidv4();

    const mystiflyDepartRequest = new OneWaySearchFlightsRequestDto();
    mystiflyDepartRequest.departureDate = departureDate;
    mystiflyDepartRequest.destinationCode = destinationCode;
    mystiflyDepartRequest.originCode = originCode;
    mystiflyDepartRequest.passengers = passengers;

    const mystiflyReturnRequest = new OneWaySearchFlightsRequestDto();
    mystiflyReturnRequest.departureDate = returnDate;
    mystiflyReturnRequest.destinationCode = originCode;
    mystiflyReturnRequest.originCode = destinationCode;
    mystiflyReturnRequest.passengers = passengers;

    const [
      mystiflySearchDepartFlightsRequestDtos,
      mystiflySearchReturnFlightsRequestDtos,
    ] = await Promise.all([
      Promise.all(
        preferredClasses.map((preferredClass) =>
          this.parseMystiflyFlightsSearchRequest(
            mystiflyDepartRequest,
            preferredClass,
            ConversationIdDepart,
          ),
        ),
      ),
      Promise.all(
        preferredClasses.map((preferredClass) =>
          this.parseMystiflyFlightsSearchRequest(
            mystiflyReturnRequest,
            preferredClass,
            ConversationIdReturn,
          ),
        ),
      ),
    ]);

    const [mystiflyDepart, mystiflyReturn] = await Promise.all([
      Promise.all(
        mystiflySearchDepartFlightsRequestDtos.map(
          (mystiflySearchDepartFlightsRequestDto) =>
            this.mystiflyFlightUtilsServiceUtil.search(
              mystiflySearchDepartFlightsRequestDto,
            ),
        ),
      ),
      Promise.all(
        mystiflySearchReturnFlightsRequestDtos.map(
          (mystiflySearchReturnFlightsRequestDto) =>
            this.mystiflyFlightUtilsServiceUtil.search(
              mystiflySearchReturnFlightsRequestDto,
            ),
        ),
      ),
    ]);

    const [
      mystiflyDepartResultsWithMappedAirportDetails,
      mystiflyReturnResultsWithMappedAirportDetails,
    ] = await Promise.all([
      Promise.all(
        mystiflyDepart.map((mystifly) =>
          this.mapMystiflySearchResultsWithAirportAndAirlineAutoSearch(
            mystifly,
          ),
        ),
      ),
      Promise.all(
        mystiflyReturn.map((mystifly) =>
          this.mapMystiflySearchResultsWithAirportAndAirlineAutoSearch(
            mystifly,
          ),
        ),
      ),
    ]);

    const MystiflyDepartData = {
      economy: mystiflyDepartResultsWithMappedAirportDetails[0],
      business: mystiflyDepartResultsWithMappedAirportDetails[1],
      first: mystiflyDepartResultsWithMappedAirportDetails[2],
      premiumEconomy: mystiflyDepartResultsWithMappedAirportDetails[3],
    };

    const MystiflyReturnData = {
      economy: mystiflyReturnResultsWithMappedAirportDetails[0],
      business: mystiflyReturnResultsWithMappedAirportDetails[1],
      first: mystiflyReturnResultsWithMappedAirportDetails[2],
      premiumEconomy: mystiflyReturnResultsWithMappedAirportDetails[3],
    };

    const MystiflyDepartDataWithPricing = this.setMystiflyPricing(
      MystiflyDepartData,
      pricings,
    );
    const MystiflyReturnDataWithPricing = this.setMystiflyPricing(
      MystiflyReturnData,
      pricings,
    );

    return {
      Depart: { MystiflyDepartDataWithPricing, ConversationIdDepart },
      Return: { MystiflyReturnDataWithPricing, ConversationIdReturn },
    };
  }

  protected setMystiflyRevalidationPricing(
    revalidationData: MystiflyRevalidationResponseDto,
    pricings: PricingsType,
  ) {
    const mystiflyRevalidationDataWithPricing = { ...revalidationData };
    const { PricedItineraries } = mystiflyRevalidationDataWithPricing.Data;
    const pricingRefs: Array<{ cabinClass: CabinClass; carrierCode: string }> =
      [];
    PricedItineraries.forEach((PricedItinerary) => {
      PricedItinerary.OriginDestinationOptions.forEach(
        (OriginDestinationOption) => {
          const { FlightSegments } = OriginDestinationOption;
          return FlightSegments.forEach((FlightSegment) => {
            let cabinClass: CabinClass;
            switch (FlightSegment.CabinClassCode) {
              case cabinPreference.economy:
                cabinClass = CabinClass.Economy;
                break;
              case cabinPreference.premium:
                cabinClass = CabinClass.Premium;
                break;
              case cabinPreference.business:
                cabinClass = CabinClass.Business;
                break;
              case cabinPreference.first:
                cabinClass = CabinClass.First;
                break;
              default:
                cabinClass = CabinClass.Economy;
            }
            pricingRefs.push({
              cabinClass,
              carrierCode: FlightSegment.OperatingAirline.Code,
            });
          });
        },
      );
    });

    // console.log('pricingRefs: ', pricingRefs);

    const pricing = pricings[pricingRefs[0].cabinClass];
    const pricingDefault = pricing['DEFAULT'];

    const pricingToBeUsed = pricingDefault;
    const { priceMargin, fixedAmount, percentage } = pricingToBeUsed;

    // console.log('pricing: ', pricing);
    // console.log('pricingDefault: ', pricingDefault);

    const newPricedItineraries = PricedItineraries.map((PricedItinerary) => {
      const TotalFare =
        PricedItinerary.AirItineraryPricingInfo.ItinTotalFare.TotalFare.Amount;
      let TotalFareWithMarkUpFloat = parseFloat(TotalFare);
      switch (priceMargin) {
        case PriceMargin.Fixed:
          TotalFareWithMarkUpFloat = TotalFareWithMarkUpFloat + fixedAmount;
          break;
        case PriceMargin.Percentage:
          TotalFareWithMarkUpFloat =
            TotalFareWithMarkUpFloat + TotalFareWithMarkUpFloat * percentage;
          break;
        case PriceMargin.Both:
          TotalFareWithMarkUpFloat =
            (TotalFareWithMarkUpFloat + fixedAmount) * percentage +
            (TotalFareWithMarkUpFloat + fixedAmount);
          break;
        default:
          TotalFareWithMarkUpFloat = TotalFareWithMarkUpFloat;
          break;
      }
      const TotalFareWithMarkUp = TotalFareWithMarkUpFloat.toString();

      PricedItinerary.AirItineraryPricingInfo.ItinTotalFare.TotalFareWithMarkUp =
        TotalFareWithMarkUp;
      return { ...PricedItinerary };
    });

    mystiflyRevalidationDataWithPricing.Data.PricedItineraries =
      newPricedItineraries;

    return mystiflyRevalidationDataWithPricing;
  }

  protected setMystiflyPricing(
    mystiflyData: {
      economy: MystiflySearch[];
      business: MystiflySearch[];
      first: MystiflySearch[];
      premiumEconomy: MystiflySearch[];
    },
    pricings: PricingsType,
  ) {
    const mystiflyDataWithPricing = mystiflyData;

    for (let key in mystiflyDataWithPricing) {
      if (Object.prototype.hasOwnProperty.call(mystiflyDataWithPricing, key)) {
        if (key === 'premiumEconomy') key = 'premium';
        const pricing = pricings[key];
        if (key === 'premium') key = 'premiumEconomy';
        const pricingDefault = pricing['DEFAULT'];

        mystiflyDataWithPricing[key] = mystiflyDataWithPricing[key].map(
          (mystiflyDatum) => {
            const operatingCarrierCodes = [
              ...new Set(
                mystiflyDatum.OriginDestinations.map((OriginDestination) => {
                  return OriginDestination.FlightSegment.OperatingCarrierCode;
                }),
              ),
            ];

            const PassengerFare = mystiflyDatum.FlightFares.PassengerFare.map(
              (fare) => {
                const { TotalFare } = fare;
                const pricingToBeUsed = pricingDefault;
                const { priceMargin, fixedAmount, percentage } =
                  pricingToBeUsed;
                let TotalFareWithMarkUpFloat = parseFloat(TotalFare);
                switch (priceMargin) {
                  case PriceMargin.Fixed:
                    TotalFareWithMarkUpFloat =
                      TotalFareWithMarkUpFloat + fixedAmount;
                    break;
                  case PriceMargin.Percentage:
                    TotalFareWithMarkUpFloat =
                      TotalFareWithMarkUpFloat +
                      TotalFareWithMarkUpFloat * percentage;
                    break;
                  case PriceMargin.Both:
                    TotalFareWithMarkUpFloat =
                      (TotalFareWithMarkUpFloat + fixedAmount) * percentage +
                      (TotalFareWithMarkUpFloat + fixedAmount);
                    break;
                  default:
                    TotalFareWithMarkUpFloat = TotalFareWithMarkUpFloat;
                    break;
                }
                const TotalFareWithMarkUp = TotalFareWithMarkUpFloat.toString();

                return { ...fare, TotalFareWithMarkUp };
              },
            );

            return {
              ...mystiflyDatum,
              FlightFares: { ...mystiflyDatum.FlightFares, PassengerFare },
            };
          },
        );
      }
    }
    return mystiflyDataWithPricing;
  }
}
