import * as moment from 'moment';
import { HotelsService } from 'src/hotels/hotels.service';
import { HotelProvider } from 'src/prebookings/prebooking-hotels/hotel-provider.enum';

import { Injectable } from '@nestjs/common';

import { OneWayBookFlightsRequestDto } from '../flights/one-way/dtos/request/one-way-book-flights-request.dto';
import { OneWayService } from '../flights/one-way/one-way.service';
import { RoundtripService } from '../flights/roundtrip/roundtrip.service';
import { FlightsRoundtripBookingConfirmationDetails } from '../nest-mailer/dtos/request/flights-roundtrip-booking-confirmation-request.dto';
import { NestMailerService } from '../nest-mailer/nest-mailer.service';
import { PaymentFlightsService } from '../payments/payment-flights/payment-flights.service';
import { PaymentHotelsService } from '../payments/payment-hotels/payment-hotels.service';
import { PaymentStatus } from '../payments/payment-status.enum';
import { CreateMystiflyFlightBookResponseRequestDto } from '../providers/mystifly/flight-book-responses/dtos/request/create-mystifly-flight-book-response-request.dto';
import { MystiflyFlightBookResponsesService } from '../providers/mystifly/flight-book-responses/mystifly-flight-book-responses.service';
import { MystiflyBookData } from '../providers/mystifly/flight-utils/dtos/response/mystifly-book-response.dto';
import { MystiflyFlightUtilsService } from '../providers/mystifly/flight-utils/mystifly-flight-utils.service';
import { TransactionFlightsService } from '../transactions/flights/transaction-flights.service';
import { TransactionHotelsService } from '../transactions/hotels/transaction-hotels.service';
import { ErrorHandlerService } from '../utils/error-handler.service';
import { MyLoggerService } from '../utils/my-logger.service';
import { CreatePaymongoEventRequestDto } from './dtos/request/create-paymongo-event-request.dto';
import { PaymongoEventsRepository } from './paymongo-events.repository';

@Injectable()
export class PaymongoEventsService {
  constructor(
    private readonly paymongoEventsRepository: PaymongoEventsRepository,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly paymentHotelsService: PaymentHotelsService,
    private readonly paymentFlightsService: PaymentFlightsService,
    private readonly oneWayService: OneWayService,
    private readonly roundtripService: RoundtripService,
    private readonly transactionFlightsService: TransactionFlightsService,
    private readonly transactionHotelsService: TransactionHotelsService,
    private readonly nestMailerService: NestMailerService,
    private readonly mystiflyFlightUtilsService: MystiflyFlightUtilsService,
    private readonly mystiflyFlightBookResponsesService: MystiflyFlightBookResponsesService,
    private readonly hotelsService: HotelsService,
  ) {}

  async create(createPaymongoEventRequestDto: CreatePaymongoEventRequestDto) {
    this.loggerService.log('create...');

    return await this.paymongoEventsRepository.create(
      createPaymongoEventRequestDto,
    );
  }

  async verifyPayment(
    createPaymongoEventRequestDto: CreatePaymongoEventRequestDto,
  ) {
    this.loggerService.log('verifyPayment...');

    const { data } = createPaymongoEventRequestDto;
    const { attributes } = data;
    const { type, data: data2 } = attributes;

    if (type === 'payment.paid') {
      const { attributes: attributes2 } = data2;
      const { payment_intent_id, status } = attributes2;

      if (status === PaymentStatus.Paid) {
        const [transactionFlight, transactionHotel] = await Promise.all([
          this.transactionFlightsService.fetchByPaymentIntentIdWithoutUserId(
            payment_intent_id,
          ),
          this.transactionHotelsService.fetchByPaymentIntentIdWithoutUserId(
            payment_intent_id,
          ),
        ]);

        // ! FLIGHTS

        if (transactionFlight) {
          if (transactionFlight.paymentFlight.status !== PaymentStatus.Paid) {
            const flightsResult =
              await this.paymentFlightsService.updateStatusToPaidByPaymentIntentId(
                payment_intent_id,
              );

            const {
              flightType,
              prebookingFlight,
              bookingFlights,
              paymentFlight,
            } = transactionFlight;

            // ! ONEWAY
            if (flightType.toLowerCase() === 'oneway') {
              const { mystiflyFlightRevalidationResponses } = prebookingFlight;
              const { passengerDetails, customerFlightDetail } =
                bookingFlights[0];

              if (mystiflyFlightRevalidationResponses.length !== 1)
                this.errorHandlerService.internalServerErrorException(
                  'MystiflyFlightRevalidationResponse is not for one way flights.',
                );
              const [fareSourceCode, conversationId, flightSegments] = [
                mystiflyFlightRevalidationResponses[0].pricedItineraries[0]
                  .AirItineraryPricingInfo.FareSourceCode,
                mystiflyFlightRevalidationResponses[0].conversationId,
                mystiflyFlightRevalidationResponses[0].pricedItineraries[0]
                  .OriginDestinationOptions[0].FlightSegments,
              ];

              console.log('passengerDetails: ', passengerDetails);

              const oneWayBookFlightsRequestDto: OneWayBookFlightsRequestDto = {
                FareSourceCode: fareSourceCode,
                ConversationId: conversationId,
                TravelerInfo: {
                  AirTravelers: passengerDetails.map((passengerDetail) => {
                    switch (passengerDetail.passengerType) {
                      case 'Adult':
                        passengerDetail.passengerType = 'ADT';
                        break;
                      case 'Child':
                        passengerDetail.passengerType = 'CHD';
                        break;
                      case 'Infant':
                        passengerDetail.passengerType = 'INF';
                        break;
                      default:
                        passengerDetail.passengerType = 'ADT';
                        break;
                    }
                    return {
                      PassengerType: passengerDetail?.passengerType,
                      Gender: 'U',
                      PassengerName: {
                        PassengerTitle: passengerDetail?.title?.toUpperCase(),
                        PassengerFirstName:
                          passengerDetail?.firstName?.toUpperCase(),
                        PassengerLastName:
                          passengerDetail?.lastName?.toUpperCase(),
                      },
                      DateOfBirth: moment(passengerDetail.birthDate).format(
                        'YYYY-MM-DDTHH:mm:SS',
                      ),
                      Passport: {
                        PassportNumber: passengerDetail?.passportNumber
                          ? passengerDetail?.passportNumber?.toUpperCase()
                          : '',
                        ExpiryDate: passengerDetail.expirationDate
                          ? moment(passengerDetail.expirationDate).format(
                              'YYYY-MM-DDTHH:mm:SS',
                            )
                          : '2025-01-03T00:00:00',
                        Country: 'PH',
                      },
                      SpecialServiceRequest: {
                        SeatPreference: 'Any',
                        MealPreference: 'Any',
                        RequestedSegments: flightSegments.map(
                          (flightSegment) => {
                            const {
                              DepartureAirportLocationCode,
                              ArrivalAirportLocationCode,
                              OperatingAirline,
                              DepartureDateTime,
                            } = flightSegment;
                            return {
                              Origin:
                                DepartureAirportLocationCode?.toUpperCase(),
                              Destination:
                                ArrivalAirportLocationCode?.toUpperCase(),
                              FlightNumber:
                                `${OperatingAirline.Code}${OperatingAirline.FlightNumber}`?.toUpperCase(),
                              DepartureDateTime: DepartureDateTime,
                              RequestSSRs: [
                                {
                                  SSRCode: 'Any',
                                  FreeText: 'Meal MOML',
                                },
                              ],
                            };
                          },
                        ),
                      },
                      PassengerNationality: 'PH',
                      NationalID: 'PH',
                    };
                  }),
                  AreaCode: null,
                  CountryCode: customerFlightDetail.mobileNumber.slice(0, 2),
                  Email: customerFlightDetail.email,
                  PhoneNumber: customerFlightDetail.mobileNumber.slice(2) ?? '',
                  PostCode: null,
                },
              };

              console.log(
                'oneWayBookFlightsRequestDto: ',
                oneWayBookFlightsRequestDto,
              );

              console.log(
                'TravelerInfo: ',
                oneWayBookFlightsRequestDto.TravelerInfo,
              );

              console.log(
                'AirTravelers: ',
                oneWayBookFlightsRequestDto.TravelerInfo.AirTravelers,
              );

              let oneWayFlightBookResponse: any = null;
              let retries = 0;
              let isSuccess = false;

              do {
                retries++;
                this.loggerService.debug('retries: ', retries);

                oneWayFlightBookResponse = await this.oneWayService
                  .book(oneWayBookFlightsRequestDto)
                  .catch((err) => err);
                isSuccess = oneWayFlightBookResponse.Success;

                console.log(
                  'oneWayFlightBookResponse: ',
                  oneWayFlightBookResponse,
                );

                if (oneWayFlightBookResponse.response !== undefined) {
                  const oneWayFlightBookResponseErr: any =
                    oneWayFlightBookResponse;
                  if (
                    oneWayFlightBookResponseErr.response?.Data.Errors.length !==
                    0
                  )
                    isSuccess = oneWayFlightBookResponseErr.response?.Success;
                  oneWayFlightBookResponse = oneWayFlightBookResponseErr
                    .response?.Data as MystiflyBookData;
                }

                if (retries === 1) break;
              } while (!isSuccess);

              let airlineRef = '';
              let bookingStatus = 'Pending';
              if (isSuccess) {
                console.log('isSuccess');
                bookingStatus = 'Confirmed';
                const tripDetails =
                  await this.mystiflyFlightUtilsService.tripDetailsV11(
                    oneWayFlightBookResponse.UniqueID,
                  );
                console.log('tripDetails: ', tripDetails);

                if (!tripDetails.Data) {
                  const tripDetailsItineraries: Array<any> =
                    tripDetails.Data.TripDetailsResult.TravelItinerary
                      .Itineraries;
                  console.log(
                    'tripDetailsItineraries: ',
                    tripDetailsItineraries,
                  );
                  const airlinePnrs = tripDetailsItineraries.map(
                    (tripDetailsItinerary) => {
                      return tripDetailsItinerary.ItineraryInfo
                        .ReservationItems[0].AirlinePNR;
                    },
                  );
                  console.log('airlinePnrs: ', airlinePnrs);
                  airlineRef =
                    airlinePnrs.length === 0 ? null : airlinePnrs.join('-');
                  console.log('airlineRef: ', airlineRef);
                }
              }

              const {
                ClientUTCOffset,
                ConversationId,
                Errors,
                Status,
                TktTimeLimit,
                TraceId,
                UniqueID,
              } = oneWayFlightBookResponse;

              const createMystiflyFlightBookResponseRequestDto: CreateMystiflyFlightBookResponseRequestDto =
                {
                  userId: bookingFlights[0].userId,
                  ClientUTCOffset,
                  ConversationId,
                  Errors,
                  sequence: 1,
                  Status,
                  TktTimeLimit,
                  TraceId,
                  UniqueID,
                  paymentReferenceNumber: paymentFlight.referenceNumber,
                  providerReference: bookingFlights[0].providerReference,
                  bookingFlight: bookingFlights[0],
                  fareSourceCode,
                };

              await this.mystiflyFlightBookResponsesService.create(
                createMystiflyFlightBookResponseRequestDto,
              );

              const { mystiflyFlightDetail } = bookingFlights[0];
              const { originDestinations } = mystiflyFlightDetail;
              const { TotalFareWithMarkUp, BaseFare, TotalFare, Quantity } =
                mystiflyFlightDetail.flightFares.PassengerFare[0] as any;

              let departureLocationDetails: any, arrivalLocationDetails: any;
              let passengerDetailsEmail: {
                name: string;
                type: string;
                checkinBaggage: string;
                cabinBaggage: string;
              }[];
              let fromAndToWithArrow = '',
                arrivalDateTime = '',
                departureDateTime = '',
                stops = '',
                origin = '',
                originAirportAndTerminal = '',
                departureTime = '',
                departureDate = '',
                destination = '',
                destinationAirportAndTerminal = '',
                arrivalTime = '',
                arrivalDate = '',
                carrier = '',
                flightNumber = '',
                cabinClass = '';

              const grandTotal = Number(TotalFareWithMarkUp);
              const baseFare = Number(BaseFare);
              const taxes = Number(TotalFare) - baseFare;
              const totalTaxesAndFees = grandTotal - (taxes + baseFare) + taxes;
              const quantity = Number(Quantity);

              if (originDestinations.length === 1) {
                const {
                  DepartureLocationDetails,
                  ArrivalLocationDetails,
                  ArrivalDateTime,
                  DepartureDateTime,
                  OperatingCarrierDetails,
                  OperatingCarrierCode,
                  OperatingFlightNumber,
                } = originDestinations[0].FlightSegment as any;

                console.log(
                  'OperatingCarrierDetails: ',
                  OperatingCarrierDetails,
                );

                departureLocationDetails = DepartureLocationDetails;
                arrivalLocationDetails = ArrivalLocationDetails;
                arrivalDateTime = String(ArrivalDateTime);
                departureDateTime = String(DepartureDateTime);
                stops = '(Non-Stop)';
                carrier = OperatingCarrierDetails?.descriptions ?? '';
                flightNumber = `${OperatingCarrierCode} ${OperatingFlightNumber}`;

                const {
                  CabinClassType,
                  CabinClassCode,
                  CheckinBaggage,
                  CabinBaggage,
                } = originDestinations[0].ItineraryReference;
                cabinClass = `${CabinClassType} (${CabinClassCode})`;

                passengerDetailsEmail = passengerDetails.map(
                  (passengerDetail) => ({
                    name: `${passengerDetail.firstName} ${passengerDetail.lastName}`,
                    type: 'ADT',
                    cabinBaggage: CabinBaggage[0].Value,
                    checkinBaggage: CheckinBaggage[0].Value,
                  }),
                );
              } else {
                const {
                  DepartureLocationDetails,
                  DepartureDateTime,
                  OperatingCarrierDetails,
                  OperatingCarrierCode,
                  OperatingFlightNumber,
                } = originDestinations[0].FlightSegment as any;
                const { ArrivalLocationDetails, ArrivalDateTime } =
                  originDestinations[originDestinations.length - 1]
                    .FlightSegment as any;

                console.log(
                  'OperatingCarrierDetails: ',
                  OperatingCarrierDetails,
                );

                departureLocationDetails = DepartureLocationDetails;
                arrivalLocationDetails = ArrivalLocationDetails;
                arrivalDateTime = String(ArrivalDateTime);
                departureDateTime = String(DepartureDateTime);
                stops = `(${originDestinations.length} Stops)`;
                carrier = OperatingCarrierDetails?.descriptions ?? '';
                flightNumber = `${OperatingCarrierCode} ${OperatingFlightNumber}`;

                const {
                  CabinClassType,
                  CabinClassCode,
                  CabinBaggage,
                  CheckinBaggage,
                } = originDestinations[0].ItineraryReference;
                cabinClass = `${CabinClassType} (${CabinClassCode})`;
                passengerDetailsEmail = passengerDetails.map(
                  (passengerDetail) => ({
                    name: `${passengerDetail.firstName} ${passengerDetail.lastName}`,
                    type: 'ADT',
                    cabinBaggage: CabinBaggage[0].Value,
                    checkinBaggage: CheckinBaggage[0].Value,
                  }),
                );
              }

              fromAndToWithArrow = `${departureLocationDetails.cityCode} (${departureLocationDetails.cityName})  →  ${arrivalLocationDetails.cityCode} (${arrivalLocationDetails.cityName})`;
              origin = `${departureLocationDetails.cityCode} (${departureLocationDetails.cityName}, ${departureLocationDetails.countryName})`;
              originAirportAndTerminal = departureLocationDetails.airportName;
              departureTime = departureDateTime.split('T')[1];
              departureDate = moment(departureDateTime.split('T')[0]).format(
                'ddd, MMMM DD, YYYY',
              );
              destination = `${arrivalLocationDetails.cityCode} (${arrivalLocationDetails.cityName}, ${arrivalLocationDetails.countryName})`;
              destinationAirportAndTerminal =
                arrivalLocationDetails.airportName;
              arrivalTime = arrivalDateTime.split('T')[1];
              arrivalDate = moment(arrivalDateTime.split('T')[0]).format(
                'ddd, MMMM DD, YYYY',
              );

              const firstDate = moment(arrivalDateTime);
              const secondDate = moment(departureDateTime);
              const totalFlightDuration = `${this.timeForHumans(
                firstDate.diff(secondDate, 'seconds'),
              )} ${stops}`;

              await this.nestMailerService.flightsOneWayBookingConfirmation({
                to: customerFlightDetail.email,
                airlineRef: airlineRef === '' ? null : airlineRef,
                bookingStatus,
                bookingNumber: transactionFlight.transactionId,
                fromAndToWithArrow,
                totalFlightDuration,
                origin,
                originAirportAndTerminal,
                departureTime,
                departureDate,
                destination,
                destinationAirportAndTerminal,
                arrivalTime,
                arrivalDate,
                carrier,
                flightNumber,
                cabinClass,
                passengerDetails: passengerDetailsEmail,
                baseFare: (baseFare * quantity).toFixed(2),
                taxes: (taxes * quantity).toFixed(2),
                totalTaxesAndFees: (totalTaxesAndFees * quantity).toFixed(2),
                grandTotal: grandTotal.toFixed(2),
              });
            }

            // ! ROUNDTRIP
            if (flightType.toLowerCase() === 'roundtrip') {
              this.loggerService.log('ROUNDTRIP');
              const { mystiflyFlightRevalidationResponses } = prebookingFlight;
              const { passengerDetails, customerFlightDetail } =
                bookingFlights[0];

              if (mystiflyFlightRevalidationResponses.length !== 2)
                this.errorHandlerService.internalServerErrorException(
                  'MystiflyFlightRevalidationResponse is not for roundtrip flights.',
                );

              const oneWayFlightBookResponses: {
                data: MystiflyBookData;
                sequence: number;
                fareSourceCode: string;
              }[] = [];

              let uniqueIdDepart = '',
                uniqueIdReturn = '';

              let airlineRef = '';
              let bookingStatus = 'Pending';

              let isDepartureSuccess = false;
              let isReturnSuccess = false;

              console.log('passengerDetails: ', passengerDetails);

              for (const mystiflyFlightRevalidationResponse of mystiflyFlightRevalidationResponses) {
                const [fareSourceCode, conversationId, flightSegments] = [
                  mystiflyFlightRevalidationResponse.pricedItineraries[0]
                    .AirItineraryPricingInfo.FareSourceCode,
                  mystiflyFlightRevalidationResponse.conversationId,
                  mystiflyFlightRevalidationResponse.pricedItineraries[0]
                    .OriginDestinationOptions[0].FlightSegments,
                ];

                const oneWayBookFlightsRequestDto: OneWayBookFlightsRequestDto =
                  {
                    FareSourceCode: fareSourceCode,
                    ConversationId: conversationId,
                    TravelerInfo: {
                      AirTravelers: passengerDetails.map((passengerDetail) => {
                        switch (passengerDetail.passengerType) {
                          case 'Adult':
                            passengerDetail.passengerType = 'ADT';
                            break;
                          case 'Child':
                            passengerDetail.passengerType = 'CHD';
                            break;
                          case 'Infant':
                            passengerDetail.passengerType = 'INF';
                            break;
                          default:
                            passengerDetail.passengerType = 'ADT';
                            break;
                        }
                        return {
                          PassengerType: passengerDetail?.passengerType,
                          Gender: 'U',
                          PassengerName: {
                            PassengerTitle:
                              passengerDetail?.title?.toUpperCase(),
                            PassengerFirstName:
                              passengerDetail?.firstName?.toUpperCase(),
                            PassengerLastName:
                              passengerDetail?.lastName?.toUpperCase(),
                          },
                          DateOfBirth: moment(passengerDetail.birthDate).format(
                            'YYYY-MM-DDTHH:mm:SS',
                          ),
                          Passport: {
                            PassportNumber: passengerDetail?.passportNumber
                              ? passengerDetail?.passportNumber?.toUpperCase()
                              : '',
                            ExpiryDate: passengerDetail.expirationDate
                              ? moment(passengerDetail.expirationDate).format(
                                  'YYYY-MM-DDTHH:mm:SS',
                                )
                              : '2025-01-03T00:00:00',
                            Country: 'PH',
                          },
                          SpecialServiceRequest: {
                            SeatPreference: 'Any',
                            MealPreference: 'Any',
                            RequestedSegments: flightSegments.map(
                              (flightSegment) => {
                                const {
                                  DepartureAirportLocationCode,
                                  ArrivalAirportLocationCode,
                                  OperatingAirline,
                                  DepartureDateTime,
                                } = flightSegment;
                                return {
                                  Origin:
                                    DepartureAirportLocationCode?.toUpperCase(),
                                  Destination:
                                    ArrivalAirportLocationCode?.toUpperCase(),
                                  FlightNumber:
                                    `${OperatingAirline.Code}${OperatingAirline.FlightNumber}`?.toUpperCase(),
                                  DepartureDateTime: DepartureDateTime,
                                  RequestSSRs: [
                                    {
                                      SSRCode: 'Any',
                                      FreeText: 'Meal MOML',
                                    },
                                  ],
                                };
                              },
                            ),
                          },
                          PassengerNationality: 'PH',
                          NationalID: 'PH',
                        };
                      }),
                      AreaCode: '',
                      CountryCode: customerFlightDetail.mobileNumber.slice(
                        0,
                        2,
                      ),
                      Email: customerFlightDetail.email,
                      PhoneNumber:
                        customerFlightDetail.mobileNumber.slice(2) ?? '',
                      PostCode: 'null',
                    },
                  };

                let oneWayFlightBookResponse: any = null;
                let retries = 0;
                let isSuccess = false;

                do {
                  retries++;
                  this.loggerService.debug('retries: ', retries);

                  oneWayFlightBookResponse = await this.oneWayService
                    .book(oneWayBookFlightsRequestDto)
                    .catch((err) => err);

                  if (mystiflyFlightRevalidationResponse.sequence === 1) {
                    uniqueIdDepart = oneWayFlightBookResponse.UniqueID;
                    isDepartureSuccess = oneWayFlightBookResponse.Success;
                  }
                  if (mystiflyFlightRevalidationResponse.sequence === 2) {
                    uniqueIdReturn = oneWayFlightBookResponse.UniqueID;
                    isReturnSuccess = oneWayFlightBookResponse.Success;
                  }

                  isSuccess = oneWayFlightBookResponse.Success;

                  if (oneWayFlightBookResponse.response !== undefined) {
                    const oneWayFlightBookResponseErr: any =
                      oneWayFlightBookResponse;
                    if (
                      oneWayFlightBookResponseErr.response?.Data.Errors
                        .length !== 0
                    )
                      isSuccess = oneWayFlightBookResponseErr.response?.Success;
                    oneWayFlightBookResponse = oneWayFlightBookResponseErr
                      .response?.Data as MystiflyBookData;
                  }

                  if (retries === 1) break;
                } while (!isSuccess);

                oneWayFlightBookResponses.push({
                  data: oneWayFlightBookResponse,
                  sequence: mystiflyFlightRevalidationResponse.sequence,
                  fareSourceCode,
                });
              }

              if (isDepartureSuccess && isReturnSuccess) {
                bookingStatus = 'Confirmed';

                let departureAirlinePnr = '';
                if (uniqueIdDepart !== '') {
                  const tripDetailsDeparture =
                    await this.mystiflyFlightUtilsService.tripDetailsV11(
                      uniqueIdDepart,
                    );
                  console.log('tripDetailsDeparture: ', tripDetailsDeparture);

                  if (!tripDetailsDeparture.Data) {
                    const departureTripDetailsItineraries: Array<any> =
                      tripDetailsDeparture.Data.TripDetailsResult
                        .TravelItinerary.Itineraries;
                    console.log(
                      'departureTripDetailsItineraries: ',
                      departureTripDetailsItineraries,
                    );
                    const airlinePnrs = departureTripDetailsItineraries.map(
                      (tripDetailsItinerary) =>
                        tripDetailsItinerary.ItineraryInfo.ReservationItems[0]
                          .AirlinePNR,
                    );
                    console.log('airlinePnrs: ', airlinePnrs);
                    departureAirlinePnr = airlinePnrs.join('-');
                    console.log('departureAirlinePnr: ', departureAirlinePnr);
                  }
                }

                let returnAirlinePnr = '';
                if (uniqueIdReturn !== '') {
                  const tripDetailsReturn =
                    await this.mystiflyFlightUtilsService.tripDetailsV11(
                      uniqueIdReturn,
                    );
                  console.log('tripDetailsReturn: ', tripDetailsReturn);

                  if (!tripDetailsReturn.Data) {
                    const returnTripDetailsItineraries: Array<any> =
                      tripDetailsReturn.Data.TripDetailsResult.TravelItinerary
                        .Itineraries;
                    console.log(
                      'returnTripDetailsItineraries: ',
                      returnTripDetailsItineraries,
                    );
                    const airlinePnrs = returnTripDetailsItineraries.map(
                      (tripDetailsItinerary) =>
                        tripDetailsItinerary.ItineraryInfo.ReservationItems[0]
                          .AirlinePNR,
                    );
                    console.log('airlinePnrs: ', airlinePnrs);
                    returnAirlinePnr = airlinePnrs.join('-');
                    console.log('returnAirlinePnr: ', returnAirlinePnr);
                  }
                }

                airlineRef =
                  uniqueIdDepart === '' || uniqueIdReturn === ''
                    ? null
                    : `${departureAirlinePnr}/${returnAirlinePnr}`;

                console.log('airlineRef: ', airlineRef);
              }

              const mystiflyFlightBookResponsesServices = await Promise.all(
                oneWayFlightBookResponses.map(
                  ({ data, sequence, fareSourceCode }, index) => {
                    const {
                      ClientUTCOffset,
                      ConversationId,
                      Errors,
                      Status,
                      TktTimeLimit,
                      TraceId,
                      UniqueID,
                    } = data;

                    const createMystiflyFlightBookResponseRequestDto: CreateMystiflyFlightBookResponseRequestDto =
                      {
                        userId: bookingFlights.find(
                          (bookingFlight) =>
                            bookingFlight.sequence === sequence,
                        ).userId,
                        ClientUTCOffset,
                        ConversationId,
                        Errors,
                        sequence,
                        Status,
                        TktTimeLimit,
                        TraceId,
                        UniqueID,
                        paymentReferenceNumber: paymentFlight.referenceNumber,
                        providerReference: bookingFlights.find(
                          (bookingFlight) =>
                            bookingFlight.sequence === sequence,
                        ).providerReference,
                        bookingFlight: bookingFlights.find(
                          (bookingFlight) =>
                            bookingFlight.sequence === sequence,
                        ),
                        fareSourceCode,
                      };

                    return this.mystiflyFlightBookResponsesService.create(
                      createMystiflyFlightBookResponseRequestDto,
                    );
                  },
                ),
              );

              const departureDetails: FlightsRoundtripBookingConfirmationDetails =
                {};
              const returnDetails: FlightsRoundtripBookingConfirmationDetails =
                {};

              let passengerDetailsEmail: {
                name: string;
                type: string;
                checkinBaggage: string;
                cabinBaggage: string;
              }[];

              let grandTotalEmail = 0;
              let baseFareEmail = 0;
              let taxesEmail = 0;
              let totalTaxesAndFeesEmail = 0;

              bookingFlights.forEach((bookingFlight, index) => {
                const { mystiflyFlightDetail } = bookingFlight;
                const { originDestinations } = mystiflyFlightDetail;
                const { Quantity, TotalFareWithMarkUp, BaseFare, TotalFare } =
                  mystiflyFlightDetail.flightFares.PassengerFare[0] as any;

                console.log('index: ', index);
                console.log('originDestinations: ', originDestinations);

                let departureLocationDetails: any, arrivalLocationDetails: any;

                let fromAndToWithArrow = '',
                  arrivalDateTime = '',
                  departureDateTime = '',
                  stops = '',
                  origin = '',
                  originAirportAndTerminal = '',
                  departureTime = '',
                  departureDate = '',
                  destination = '',
                  destinationAirportAndTerminal = '',
                  arrivalTime = '',
                  arrivalDate = '',
                  carrier = '',
                  flightNumber = '',
                  cabinClass = '';

                const quantity = Number(Quantity);
                const grandTotal = Number(TotalFareWithMarkUp) * quantity;
                const baseFare = Number(BaseFare) * quantity;
                const taxes = (Number(TotalFare) - baseFare) * quantity;
                const totalTaxesAndFees =
                  (grandTotal - (taxes + baseFare) + taxes) * quantity;
                if (originDestinations.length === 1) {
                  const {
                    DepartureLocationDetails,
                    ArrivalLocationDetails,
                    ArrivalDateTime,
                    DepartureDateTime,
                    OperatingCarrierDetails,
                    OperatingCarrierCode,
                    OperatingFlightNumber,
                  } = originDestinations[0].FlightSegment as any;

                  console.log(
                    'OperatingCarrierDetails: ',
                    OperatingCarrierDetails,
                  );

                  departureLocationDetails = DepartureLocationDetails;
                  arrivalLocationDetails = ArrivalLocationDetails;
                  arrivalDateTime = String(ArrivalDateTime);
                  departureDateTime = String(DepartureDateTime);
                  stops = '(Non-Stop)';
                  carrier = OperatingCarrierDetails?.descriptions ?? '';
                  flightNumber = `${OperatingCarrierCode} ${OperatingFlightNumber}`;

                  const {
                    CabinClassType,
                    CabinClassCode,
                    CheckinBaggage,
                    CabinBaggage,
                  } = originDestinations[0].ItineraryReference;
                  cabinClass = `${CabinClassType} (${CabinClassCode})`;

                  passengerDetailsEmail = passengerDetails.map(
                    (passengerDetail) => ({
                      name: `${passengerDetail.firstName} ${passengerDetail.lastName}`,
                      type: 'ADT',
                      cabinBaggage: CabinBaggage[0].Value,
                      checkinBaggage: CheckinBaggage[0].Value,
                    }),
                  );

                  grandTotalEmail = grandTotalEmail + grandTotal;
                  baseFareEmail = baseFareEmail + baseFare;
                  taxesEmail = taxesEmail + taxes;
                  totalTaxesAndFeesEmail =
                    totalTaxesAndFeesEmail + totalTaxesAndFees;
                } else {
                  const {
                    DepartureLocationDetails,
                    DepartureDateTime,
                    OperatingCarrierDetails,
                    OperatingCarrierCode,
                    OperatingFlightNumber,
                  } = originDestinations[0].FlightSegment as any;
                  const { ArrivalLocationDetails, ArrivalDateTime } =
                    originDestinations[originDestinations.length - 1]
                      .FlightSegment as any;

                  console.log(
                    'OperatingCarrierDetails: ',
                    OperatingCarrierDetails,
                  );

                  departureLocationDetails = DepartureLocationDetails;
                  arrivalLocationDetails = ArrivalLocationDetails;
                  arrivalDateTime = String(ArrivalDateTime);
                  departureDateTime = String(DepartureDateTime);
                  stops = `(${originDestinations.length} Stops)`;
                  carrier = OperatingCarrierDetails?.descriptions ?? '';
                  flightNumber = `${OperatingCarrierCode} ${OperatingFlightNumber}`;

                  const {
                    CabinClassType,
                    CabinClassCode,
                    CabinBaggage,
                    CheckinBaggage,
                  } = originDestinations[0].ItineraryReference;
                  cabinClass = `${CabinClassType} (${CabinClassCode})`;
                  passengerDetailsEmail = passengerDetails.map(
                    (passengerDetail) => ({
                      name: `${passengerDetail.firstName} ${passengerDetail.lastName}`,
                      type: 'ADT',
                      cabinBaggage: CabinBaggage[0].Value,
                      checkinBaggage: CheckinBaggage[0].Value,
                    }),
                  );

                  grandTotalEmail = grandTotalEmail + grandTotal;
                  baseFareEmail = baseFareEmail + baseFare;
                  taxesEmail = taxesEmail + taxes;
                  totalTaxesAndFeesEmail =
                    totalTaxesAndFeesEmail + totalTaxesAndFees;
                }

                fromAndToWithArrow = `${departureLocationDetails.cityCode} (${departureLocationDetails.cityName})  →  ${arrivalLocationDetails.cityCode} (${arrivalLocationDetails.cityName})`;
                origin = `${departureLocationDetails.cityCode} (${departureLocationDetails.cityName}, ${departureLocationDetails.countryName})`;
                originAirportAndTerminal = departureLocationDetails.airportName;
                departureTime = departureDateTime.split('T')[1];
                departureDate = moment(departureDateTime.split('T')[0]).format(
                  'ddd, MMMM DD, YYYY',
                );
                destination = `${arrivalLocationDetails.cityCode} (${arrivalLocationDetails.cityName}, ${arrivalLocationDetails.countryName})`;
                destinationAirportAndTerminal =
                  arrivalLocationDetails.airportName;
                arrivalTime = arrivalDateTime.split('T')[1];
                arrivalDate = moment(arrivalDateTime.split('T')[0]).format(
                  'ddd, MMMM DD, YYYY',
                );

                const firstDate = moment(arrivalDateTime);
                const secondDate = moment(departureDateTime);
                const totalFlightDuration = `${this.timeForHumans(
                  firstDate.diff(secondDate, 'seconds'),
                )} ${stops}`;

                if (bookingFlight.sequence === 1) {
                  departureDetails.arrivalDate = arrivalDate;
                  departureDetails.arrivalTime = arrivalTime;
                  departureDetails.cabinClass = cabinClass;
                  departureDetails.carrier = carrier;
                  departureDetails.departureDate = departureDate;
                  departureDetails.departureTime = departureTime;
                  departureDetails.destination = destination;
                  departureDetails.destinationAirportAndTerminal =
                    destinationAirportAndTerminal;
                  departureDetails.flightNumber = flightNumber;
                  departureDetails.fromAndToWithArrow = fromAndToWithArrow;
                  departureDetails.origin = origin;
                  departureDetails.originAirportAndTerminal =
                    originAirportAndTerminal;
                  departureDetails.totalFlightDuration = totalFlightDuration;
                }
                if (bookingFlight.sequence === 2) {
                  returnDetails.arrivalDate = arrivalDate;
                  returnDetails.arrivalTime = arrivalTime;
                  returnDetails.cabinClass = cabinClass;
                  returnDetails.carrier = carrier;
                  returnDetails.departureDate = departureDate;
                  returnDetails.departureTime = departureTime;
                  returnDetails.destination = destination;
                  returnDetails.destinationAirportAndTerminal =
                    destinationAirportAndTerminal;
                  returnDetails.flightNumber = flightNumber;
                  returnDetails.fromAndToWithArrow = fromAndToWithArrow;
                  returnDetails.origin = origin;
                  returnDetails.originAirportAndTerminal =
                    originAirportAndTerminal;
                  returnDetails.totalFlightDuration = totalFlightDuration;
                }
              });

              await this.nestMailerService.flightsRoundtripBookingConfirmation({
                to: customerFlightDetail.email,
                departureDetails: departureDetails,
                returnDetails: returnDetails,
                passengerDetails: passengerDetailsEmail,
                baseFare: baseFareEmail.toFixed(2),
                taxes: taxesEmail.toFixed(2),
                totalTaxesAndFees: totalTaxesAndFeesEmail.toFixed(2),
                grandTotal: grandTotalEmail.toFixed(2),
                airlineRef,
                bookingStatus,
                bookingNumber: transactionFlight.transactionId,
              });
            }

            if (flightsResult) return true;
          }
        }

        // ! HOTELS

        if (transactionHotel) {
          const hotelsResult =
            await this.paymentHotelsService.updateStatusToPaidByPaymentIntentId(
              payment_intent_id,
            );

          const { prebookingHotel, bookingHotels } = transactionHotel;
          const { provider } = prebookingHotel;

          if (provider.toLowerCase() === HotelProvider.Tbo) {
            // const x = await this.hotelsService.book({})
          }

          bookingHotels.map((bookingHotel) => {});

          if (hotelsResult) return true;
        }
      }
      return false;
    }
    return false;
  }

  private timeForHumans(seconds: number) {
    const hours = seconds / 3600;
    const _hours = hours.toString().split('.');
    if (_hours.length == 1) return `${_hours[0]}h`;
    let minutes = _hours[1] !== undefined ? Number('.' + _hours[1]) : 0;
    minutes = minutes * 60;
    const roundedMinutes = Math.round(minutes);
    return `${_hours[0]}h ${roundedMinutes}min`;
  }
}
