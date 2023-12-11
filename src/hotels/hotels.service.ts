import { Cache } from 'cache-manager';
import { TboHotelResult } from 'src/providers/tbo/hotel-utils/hotels/dtos/response/tbo-search-hotels-response.dto';

import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

import { AggregatesService } from '../providers/aggregates/aggregates.service';
import {
  TboBookRequestDto,
  TboCustomerName,
} from '../providers/tbo/hotel-utils/hotels/dtos/request/tbo-book-request.dto';
import {
  TboPaxRooms,
  TboSearchHotelsRequestDto,
} from '../providers/tbo/hotel-utils/hotels/dtos/request/tbo-search-hotels-request.dto';
import { TboHotelDetails } from '../providers/tbo/hotel-utils/hotels/dtos/response/tbo-hotel-details-response.dto';
import { TboHotelsService } from '../providers/tbo/hotel-utils/hotels/tbo-hotels.service';
import { ErrorHandlerService } from '../utils/error-handler.service';
import { MyLoggerService } from '../utils/my-logger.service';
import {
  BookHotelsCustomerName,
  BookHotelsRequestDto,
} from './dtos/request/book-hotels-request.dto';
import { PreBookHotelsRequestDto } from './dtos/request/prebook-hotels-request.dto';
import { SearchHotelsRequestDto } from './dtos/request/search-hotels-request.dto';

// class Test extends TboHotelResult, TboHotelDetails { }

@Injectable()
export class HotelsService {
  private readonly DEFAULT_RESPONSE_TIME = 10;
  private readonly DEFAULT_CHILDREN_AGE = 12;
  private readonly DEFAULT_GUEST_NATIONALITY = 'PH';
  private readonly DEFAULT_IS_DETAILED_RESPONSE = true;
  private readonly DEFAULT_FILTERS_REFUNDABLE = null;
  private readonly DEFAULT_NO_OF_ROOMS = null;
  private readonly DEFAULT_MEAL_TYPE = null;

  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly tboHotelsService: TboHotelsService,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly aggregatesService: AggregatesService,
  ) {}

  async search(searchHotelsRequestDto: SearchHotelsRequestDto) {
    this.loggerService.log('search...');

    const { checkInDate, checkOutDate, location, rooms, adults, children } =
      searchHotelsRequestDto;

    const cacheName =
      `flights_roundtrip_${checkInDate}_${checkOutDate}_${location}_${rooms}_${adults}_${
        children ?? 0
      }`.replaceAll('/', '_');
    const cachedData: any = await this.cacheManager.get(cacheName);
    if (cachedData) {
      this.loggerService.log('get cache...');
      return cachedData;
    }

    const response = {
      tbo: await this.parseTboResults(searchHotelsRequestDto),
    };

    if (response.tbo.length !== 0)
      await this.cacheManager.set(cacheName, response);

    return response;
  }

  async preBook(preBookHotelsRequestDto: PreBookHotelsRequestDto) {
    this.loggerService.log('preBook...');

    const { bookingCodes } = preBookHotelsRequestDto;

    // const tboPreBookRequestDto: TboPreBookRequestDto = {
    //   BookingCode: preBookHotelsRequestDto.bookingCode,
    //   paymentMode: 'Limit',
    // };
    // const tobHotelsPrebookResponse = await this.tboHotelsService.preBook(
    //   tboPreBookRequestDto,
    // );

    const tobHotelsPrebookResponses = await Promise.all(
      bookingCodes.map((bookingCode) =>
        this.tboHotelsService.preBook({
          BookingCode: bookingCode,
          paymentMode: 'Limit',
        }),
      ),
    );
    const tboPreBookingResults = tobHotelsPrebookResponses.map(
      (tobHotelsPrebookResponse) => tobHotelsPrebookResponse.HotelResult[0],
    );

    return {
      tbo: tboPreBookingResults,
    };
  }

  async book(bookHotelsRequestDto: BookHotelsRequestDto) {
    this.loggerService.log('book...');

    const referenceId = new Date().getTime();

    const tboBookRequestDto = this.classMapper.map(
      bookHotelsRequestDto,
      BookHotelsRequestDto,
      TboBookRequestDto,
    );
    tboBookRequestDto.CustomerDetails = [
      {
        CustomerNames: this.classMapper.mapArray(
          bookHotelsRequestDto.customerNames,
          BookHotelsCustomerName,
          TboCustomerName,
        ),
      },
    ];
    tboBookRequestDto.BookingReferenceId = referenceId.toString();
    tboBookRequestDto.ClientReferenceId = referenceId.toString();
    tboBookRequestDto.BookingType = 'Voucher';
    tboBookRequestDto.PaymentMode = 'Limit';

    const tboHotelBookResponse = await this.tboHotelsService.book(
      tboBookRequestDto,
    );

    if (tboHotelBookResponse.Status.Code !== 200)
      this.errorHandlerService.internalServerErrorException(
        tboHotelBookResponse.Status.Description,
      );

    delete tboHotelBookResponse.Status;
    return tboHotelBookResponse;
  }

  private populatePaxRooms({ rooms, adults, children }): TboPaxRooms[] {
    const paxRooms: TboPaxRooms[] = [];

    if (!adults)
      this.errorHandlerService.badRequestException('Must have an adult');

    if (rooms > adults)
      this.errorHandlerService.badRequestException(
        'Rooms cannot be greater than adults',
      );

    if (rooms === adults) {
      for (let count = 1; count <= rooms; count++) {
        const room: TboPaxRooms = {
          Adults: 1,
          Children: 0,
          ChildrenAges: [],
        };
        paxRooms.push(room);
      }
    }

    if (rooms !== adults) {
      for (let count = 1; count <= rooms; count++) {
        const room: TboPaxRooms = {
          Adults: 0,
          Children: 0,
          ChildrenAges: [],
        };
        paxRooms.push(room);
      }
      let adultsCount = adults;
      while (adultsCount) {
        paxRooms.forEach((paxRoom) => {
          if (!adultsCount) return;
          paxRoom.Adults++;
          adultsCount--;
        });
      }
    }

    if (children) {
      let childrenCount = children;
      while (childrenCount) {
        paxRooms.forEach((paxRoom) => {
          if (!childrenCount) return;
          paxRoom.Children++;
          paxRoom.ChildrenAges.push(this.DEFAULT_CHILDREN_AGE);
          childrenCount--;
        });
      }
    }

    return paxRooms;
  }

  private async fetchAllHotelCodesWithAutoSearch(keyword: string) {
    this.loggerService.log('fetchAllHotelCodesWithAutoSearch...');
    const { tag: hotels } = await this.aggregatesService.tboHotelAutoSearch({
      keyword,
      page: '1',
      pagination: '1344',
    });

    return hotels.length !== 0
      ? hotels.map((hotel) => hotel.HotelCode).join(',')
      : '';
  }

  private async parseTboResultsOld(
    searchHotelsRequestDto: SearchHotelsRequestDto,
  ) {
    const { checkInDate, checkOutDate, location, rooms, adults, children } =
      searchHotelsRequestDto;
    const hotelCodes = await this.fetchAllHotelCodesWithAutoSearch(location);
    const tboSearchRequestDto: TboSearchHotelsRequestDto = {
      CheckIn: checkInDate,
      CheckOut: checkOutDate,
      HotelCodes: hotelCodes,
      PaxRooms: this.populatePaxRooms({ rooms, children, adults }),
      GuestNationality: this.DEFAULT_GUEST_NATIONALITY,
      ResponseTime: this.DEFAULT_RESPONSE_TIME,
      IsDetailedResponse: this.DEFAULT_IS_DETAILED_RESPONSE,
      Filters: {
        Refundable: this.DEFAULT_FILTERS_REFUNDABLE,
        NoOfRooms: this.DEFAULT_NO_OF_ROOMS,
        MealType: this.DEFAULT_MEAL_TYPE,
      },
    };
    const { HotelResult: tbo } = await this.tboHotelsService.search(
      tboSearchRequestDto,
    );
    const result: TboHotelResult[] & TboHotelDetails[] = [];
    if (tbo) {
      const hotelCodesArr = tbo.map((data) => data.HotelCode);
      const hotelDetailsResult = await Promise.all(
        hotelCodesArr.map((hotelCodes) =>
          this.tboHotelsService.fetchHotelDetails(hotelCodes),
        ),
      );
      const hotelDetails: TboHotelDetails[] = [];
      hotelDetailsResult.forEach((hotelDetail) => {
        hotelDetails.push(...hotelDetail.HotelDetails);
      });
      tbo.forEach((tboHotelResult) => {
        const hotelDetail = hotelDetails.find((hotelDetail) => {
          if (hotelDetail.HotelCode === tboHotelResult.HotelCode)
            return hotelDetail;
        });
        result.push({ ...tboHotelResult, ...hotelDetail });
      });
    }
    return result;
  }

  private async parseTboResults(
    searchHotelsRequestDto: SearchHotelsRequestDto,
  ) {
    const { checkInDate, checkOutDate, location, rooms, adults, children } =
      searchHotelsRequestDto;
    const hotelCodes = await this.fetchAllHotelCodesWithAutoSearch(location);
    const paxRooms = this.populatePaxRooms({ rooms, children, adults });
    const tboSearchRequestDtos: TboSearchHotelsRequestDto[] = paxRooms.map(
      (paxRoom) => {
        return {
          CheckIn: checkInDate,
          CheckOut: checkOutDate,
          HotelCodes: hotelCodes,
          PaxRooms: [paxRoom],
          GuestNationality: this.DEFAULT_GUEST_NATIONALITY,
          ResponseTime: this.DEFAULT_RESPONSE_TIME,
          IsDetailedResponse: this.DEFAULT_IS_DETAILED_RESPONSE,
          Filters: {
            Refundable: this.DEFAULT_FILTERS_REFUNDABLE,
            NoOfRooms: this.DEFAULT_NO_OF_ROOMS,
            MealType: this.DEFAULT_MEAL_TYPE,
          },
        };
      },
    );
    const hotelQueryResults = await Promise.all(
      tboSearchRequestDtos.map((tboSearchRequestDto) =>
        this.tboHotelsService.search(tboSearchRequestDto),
      ),
    );
    const hotelResults = hotelQueryResults.map(({ HotelResult }, index) => {
      const rooms: any = HotelResult[0].Rooms.map((room) => {
        room.Adults = paxRooms[index].Adults;
        room.Children = paxRooms[index].Children;
        return room;
      });
      HotelResult[0].Rooms = rooms;
      return HotelResult;
    });
    const newHotelResult: TboHotelResult[] = [];
    hotelResults.forEach((hotelResult) => {
      if (!hotelResult) return;
      const item: TboHotelResult = {
        Currency: '',
        HotelCode: '',
        Rooms: [],
      };
      const hotelCodeIndex = newHotelResult[0]?.HotelCode?.indexOf(
        hotelResult[0]?.HotelCode,
      );
      const currencyIndex = newHotelResult[0]?.Currency.indexOf(
        hotelResult[0]?.Currency,
      );
      if (hotelCodeIndex === -1 || !hotelCodeIndex)
        item.HotelCode = hotelResult[0]?.HotelCode;
      if (currencyIndex === -1 || !currencyIndex)
        item.Currency = hotelResult[0]?.Currency;
      item.Rooms = hotelResult[0]?.Rooms;
      if (newHotelResult.length === 0) newHotelResult.push(item);
      else
        newHotelResult[0].Rooms = [
          ...newHotelResult[0].Rooms,
          ...hotelResult[0]?.Rooms,
        ];
    });

    const result: TboHotelResult[] & TboHotelDetails[] = [];
    if (newHotelResult) {
      const hotelCodesArr = newHotelResult.map((data) => data.HotelCode);
      const hotelDetailsResult = await Promise.all(
        hotelCodesArr.map((hotelCodes) =>
          this.tboHotelsService.fetchHotelDetails(hotelCodes),
        ),
      );
      const hotelDetails: TboHotelDetails[] = [];
      hotelDetailsResult.forEach((hotelDetail) => {
        hotelDetails.push(...hotelDetail.HotelDetails);
      });
      newHotelResult.forEach((tboHotelResult) => {
        const hotelDetail = hotelDetails.find((hotelDetail) => {
          if (hotelDetail.HotelCode === tboHotelResult.HotelCode)
            return hotelDetail;
        });
        result.push({ ...tboHotelResult, ...hotelDetail });
      });
    }
    return result;
  }
}
