import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { CustomerHotelDetailsService } from '../../customer-details/hotels/customer-hotel-details.service';
import { PaymentHotel } from '../../payments/payment-hotels/payment-hotel.entity';
import { PaymentHotelsService } from '../../payments/payment-hotels/payment-hotels.service';
import { TboHotelDetailsService } from '../../providers/tbo/hotel-details/tbo-hotel-details.service';
import { TransactionHotelsService } from '../../transactions/hotels/transaction-hotels.service';
import { ErrorHandlerService } from '../../utils/error-handler.service';
import { MyLoggerService } from '../../utils/my-logger.service';
import { BookingHotel } from './booking-hotel.entity';
import { BookingHotelsRepository } from './booking-hotels.repository';
import { CreateBookingHotelRequestDto } from './dtos/request/create-booking-hotel-request.dto';
import { UpdateBookingHotelRequestDto } from './dtos/request/update-booking-hotel-request.dto';
import { HotelProvider } from './hotel-provider.enum';

@Injectable()
export class BookingHotelsService {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @Inject(REQUEST) private readonly request: RequestWithUser,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly bookingHotelsRepository: BookingHotelsRepository,
    private readonly paymentHotelsService: PaymentHotelsService,
    private readonly transactionHotelsService: TransactionHotelsService,
    private readonly customerHotelDetailsService: CustomerHotelDetailsService,
    private readonly tboHotelDetailsService: TboHotelDetailsService,
  ) {}

  async create(createBookingHotelsRequestDto: CreateBookingHotelRequestDto) {
    this.loggerService.log('create...');

    const {
      transactionId,
      customerDetail,
      paymentHotelDetail,
      rooms,
      provider,
      providerDetails,
    } = createBookingHotelsRequestDto;
    const { amount, discount, name, paymentIntentId, referenceNumber } =
      paymentHotelDetail;

    const [transactionHotel, paymentHotelDB] = await Promise.all([
      this.transactionHotelsService.fetchByTransactionId(transactionId),
      this.paymentHotelsService
        .fetchByReferenceNumber(referenceNumber)
        .catch((err) => err),
    ]);

    if (provider.toLowerCase() === HotelProvider.Tbo) {
      if (
        transactionHotel.prebookingHotel.tboHotelPrebookResponses.length !==
        rooms
      )
        this.errorHandlerService.conflictException(
          'Rooms and transactionHotel.prebookingHotel.tboHotelPrebookResponses.length are not equal',
        );
      if (+providerDetails.Rooms?.length !== rooms)
        this.errorHandlerService.conflictException(
          'Rooms and providerDetails.Rooms are not equal',
        );
    }

    if (transactionHotel.bookingHotels.length !== 0)
      this.errorHandlerService.internalServerErrorException(
        'Transaction already booked!',
      );
    if (paymentHotelDB)
      if (paymentHotelDB instanceof PaymentHotel)
        this.errorHandlerService.internalServerErrorException(
          'PaymentHotel: referenceNumber already exists',
        );

    const [customerHotelDetail, paymentHotel] = await Promise.all([
      this.customerHotelDetailsService.create(customerDetail),
      this.paymentHotelsService.create({
        amount: +amount,
        discount,
        name,
        paymentIntentId,
        referenceNumber,
      }),
    ]);

    const bookingHotel = this.classMapper.map(
      createBookingHotelsRequestDto,
      CreateBookingHotelRequestDto,
      BookingHotel,
    );
    bookingHotel.userId = this.request.user?.id ?? null;
    bookingHotel.customerHotelDetail = customerHotelDetail;
    bookingHotel.providerReference =
      transactionHotel.prebookingHotel.providerReference;

    let bookingHotels: BookingHotel[];

    if (provider.toLowerCase() === HotelProvider.Tbo) {
      providerDetails.providerReference =
        transactionHotel.prebookingHotel.providerReference;
      const tboHotelDetails = await Promise.all(
        providerDetails.Rooms.map((room) => {
          const providerDetail = { ...providerDetails };
          providerDetail.Rooms = [room];
          return this.tboHotelDetailsService.create(providerDetail);
        }),
      );
      bookingHotels = await Promise.all(
        tboHotelDetails.map((tboHotelDetail) => {
          const bookingHotelTemp = { ...bookingHotel };
          bookingHotelTemp.tboHotelDetail = tboHotelDetail;
          bookingHotelTemp.adults = tboHotelDetail.rooms[0].Adults;
          bookingHotelTemp.children = tboHotelDetail.rooms[0].Children;
          return this.bookingHotelsRepository.create(bookingHotelTemp);
        }),
      );
    }

    await this.transactionHotelsService.update({
      id: transactionHotel.id,
      bookingHotels,
      paymentHotel,
    });

    return bookingHotels;
  }

  async fetchAll() {
    this.loggerService.log('fetchAll...');
    return await this.bookingHotelsRepository.fetchAll();
  }

  async fetchById(id: number) {
    this.loggerService.log('fetchById...');

    const bookingHotel = await this.bookingHotelsRepository.fetchById(id);
    if (!bookingHotel)
      this.errorHandlerService.notFoundException('Id not found');
    return bookingHotel;
  }

  async update(updateBookingHotelsRequestDto: UpdateBookingHotelRequestDto) {
    this.loggerService.log('update...');

    const { id } = updateBookingHotelsRequestDto;
    const bookingHotelDB = await this.bookingHotelsRepository.fetchById(id);
    if (!bookingHotelDB)
      this.errorHandlerService.notFoundException('Id not found');

    const bookingHotel = this.classMapper.map(
      updateBookingHotelsRequestDto,
      UpdateBookingHotelRequestDto,
      BookingHotel,
    );

    return await this.bookingHotelsRepository.update(bookingHotel);
  }

  async deleteById(id: number) {
    this.loggerService.log('deleteById...');

    const hotelPayment = await this.bookingHotelsRepository.fetchById(id);
    if (!hotelPayment)
      this.errorHandlerService.notFoundException('Id not found');

    const isSuccess = await this.bookingHotelsRepository.deleteById(id);
    if (!isSuccess)
      this.errorHandlerService.internalServerErrorException('Delete failed!');

    return 'Delete successful!';
  }
}
