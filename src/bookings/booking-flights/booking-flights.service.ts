import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { CustomerFlightDetailsService } from '../../customer-details/flights/customer-flight-details.service';
import { PassengerDetailsService } from '../../flights/passenger-details/passenger-details.service';
import { CreatePaymentFlightRequestDto } from '../../payments/payment-flights/dtos/request/create-payment-flight-request.dto';
import { PaymentFlight } from '../../payments/payment-flights/payment-flight.entity';
import { PaymentFlightsService } from '../../payments/payment-flights/payment-flights.service';
import { PrebookingFlightsService } from '../../prebookings/prebooking-flights/prebooking-flights.service';
import { MystiflyFlightDetailsService } from '../../providers/mystifly/flight-details/mystifly-flight-details.service';
import { TransactionFlightsService } from '../../transactions/flights/transaction-flights.service';
import { ErrorHandlerService } from '../../utils/error-handler.service';
import { MyLoggerService } from '../../utils/my-logger.service';
import { BookingFlight } from './booking-flight.entity';
import { BookingFlightsRepository } from './booking-flights.repository';
import { CreateBookingFlightRequestDto } from './dtos/request/create-booking-flight-request.dto';
import { CreateOneWayBookingFlightRequestDto } from './dtos/request/create-one-way-booking-flight-request.dto';
import { CreateRoundtripBookingFlightRequestDto } from './dtos/request/create-roundtrip-booking-flight-request.dto';
import { UpdateBookingFlightRequestDto } from './dtos/request/update-booking-flight-request.dto';
import { FlightProvider } from './flight-provider.enum';

@Injectable()
export class BookingFlightsService {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @Inject(REQUEST) private readonly request: RequestWithUser,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly bookingFlightsRepository: BookingFlightsRepository,
    private readonly paymentFlightsService: PaymentFlightsService,
    private readonly transactionFlightsService: TransactionFlightsService,
    private readonly customerFlightDetailsService: CustomerFlightDetailsService,
    private readonly mystiflyFlightDetailsService: MystiflyFlightDetailsService,
    private readonly passengerDetailsService: PassengerDetailsService,
    private readonly prebookingFlightsService: PrebookingFlightsService,
  ) {}

  async create(createBookingFlightRequestDto: CreateBookingFlightRequestDto) {
    this.loggerService.log('create...');

    this.loggerService.debug(
      'createBookingFlightRequestDto: ',
      createBookingFlightRequestDto,
    );

    const {
      transactionId,
      customerDetails,
      providerDetails,
      provider,
      passengerDetails,
      paymentFlightDetails,
    } = createBookingFlightRequestDto;

    const { amount, discount, name, paymentIntentId, referenceNumber } =
      paymentFlightDetails;

    const [transactionFlight, paymentFlightDB] = await Promise.all([
      this.transactionFlightsService.fetchByTransactionId(transactionId),
      this.paymentFlightsService
        .fetchByReferenceNumber(referenceNumber)
        .catch((err) => err),
    ]);

    if (transactionFlight.bookingFlights.length !== 0)
      this.errorHandlerService.internalServerErrorException(
        'Transaction already booked!',
      );

    if (paymentFlightDB)
      if (paymentFlightDB instanceof PaymentFlight)
        this.errorHandlerService.internalServerErrorException(
          'PaymentFlight: referenceNumber already exists',
        );

    this.loggerService.debug('transactionFlight: ', transactionFlight);

    const [customerFlightDetail, paymentFlight, passengerDetailsDB] =
      await Promise.all([
        this.customerFlightDetailsService.create(customerDetails),
        this.paymentFlightsService.create({
          amount: +amount,
          discount,
          name,
          paymentIntentId,
          referenceNumber,
        }),
        Promise.all(
          passengerDetails.map((passengerDetails) =>
            this.passengerDetailsService.create(passengerDetails),
          ),
        ),
      ]);

    this.loggerService.debug('customerFlightDetail: ', customerFlightDetail);
    this.loggerService.debug('paymentFlight: ', paymentFlight);

    const bookingFlight = this.classMapper.map(
      createBookingFlightRequestDto,
      CreateBookingFlightRequestDto,
      BookingFlight,
    );

    bookingFlight.userId = this.request.user?.id ?? null;
    bookingFlight.flightReference = transactionFlight.flightReference;
    bookingFlight.customerFlightDetail = customerFlightDetail;
    bookingFlight.passengerDetails = passengerDetailsDB;
    bookingFlight.providerReference =
      transactionFlight.prebookingFlight.providerReference;
    bookingFlight.transactionFlight = transactionFlight;
    bookingFlight.sequence = 1;

    this.loggerService.debug('bookingFlight: ', bookingFlight);

    let newBookingFlight: BookingFlight;

    if (provider.toLowerCase() === FlightProvider.Mystifly) {
      providerDetails.providerReference = bookingFlight.providerReference;
      providerDetails.paymentReferenceNumber = paymentFlight.referenceNumber;
      providerDetails.sequence = 1;

      const promiseResults = await Promise.all([
        this.bookingFlightsRepository.create(bookingFlight),
        this.mystiflyFlightDetailsService.create(providerDetails),
      ]);
      this.loggerService.debug('promiseResults: ', promiseResults);
      newBookingFlight = promiseResults[0];
      newBookingFlight.mystiflyFlightDetail = promiseResults[1];
    }

    this.loggerService.debug('transactionFlight: ', transactionFlight);

    await this.transactionFlightsService.update({
      id: transactionFlight.id,
      paymentFlight,
      bookingFlights: [newBookingFlight],
    });

    return newBookingFlight;
  }

  async createRoundtrip(
    createRoundtripBookingFlightRequestDto: CreateRoundtripBookingFlightRequestDto,
  ) {
    this.loggerService.log('createRountrip...');

    const {
      transactionId,
      returnDate,
      origin,
      destination,
      customerDetails,
      providerDetails,
      provider,
      passengerDetails,
      paymentFlightDetails,
    } = createRoundtripBookingFlightRequestDto;

    const { amount, discount, name, paymentIntentId, referenceNumber } =
      paymentFlightDetails;

    const [transactionFlight, paymentFlightDB] = await Promise.all([
      this.transactionFlightsService.fetchByTransactionId(transactionId),
      this.paymentFlightsService
        .fetchByReferenceNumber(referenceNumber)
        .catch((err) => err),
    ]);

    if (transactionFlight.bookingFlights.length !== 0)
      this.errorHandlerService.internalServerErrorException(
        'Transaction already booked!',
      );

    if (paymentFlightDB) {
      if (paymentFlightDB instanceof PaymentFlight)
        this.errorHandlerService.internalServerErrorException(
          'PaymentFlight: referenceNumber already exists',
        );
    }

    const createPaymentFlightRequestDto: CreatePaymentFlightRequestDto = {
      amount: +amount,
      discount,
      name,
      paymentIntentId,
      referenceNumber,
    };

    const [customerFlightDetail, paymentFlight] = await Promise.all([
      this.customerFlightDetailsService.create(customerDetails),
      this.paymentFlightsService.create(createPaymentFlightRequestDto),
    ]);

    const passengerDetailsDB = await Promise.all(
      passengerDetails.map((passengerDetails) =>
        this.passengerDetailsService.create(passengerDetails),
      ),
    );

    const bookingFlightDeparture = this.classMapper.map(
      createRoundtripBookingFlightRequestDto,
      CreateRoundtripBookingFlightRequestDto,
      BookingFlight,
    );
    bookingFlightDeparture.userId = this.request.user?.id ?? null;
    bookingFlightDeparture.flightReference = transactionFlight.flightReference;
    bookingFlightDeparture.customerFlightDetail = customerFlightDetail;
    bookingFlightDeparture.passengerDetails = passengerDetailsDB;
    bookingFlightDeparture.providerReference =
      transactionFlight.prebookingFlight.providerReference;
    bookingFlightDeparture.sequence = 1;
    bookingFlightDeparture.transactionFlight = transactionFlight;

    console.log('bookingFlightDeparture: ', bookingFlightDeparture);

    const bookingFlightReturn = { ...bookingFlightDeparture };
    bookingFlightReturn.departureDate = returnDate;
    bookingFlightReturn.origin = destination;
    bookingFlightReturn.destination = origin;
    bookingFlightReturn.sequence = 2;

    console.log('bookingFlightReturn: ', bookingFlightReturn);

    let newBookingFlights: BookingFlight[];

    if (provider.toLowerCase() === FlightProvider.Mystifly) {
      providerDetails.departureDetails.providerReference =
        bookingFlightDeparture.providerReference;
      providerDetails.departureDetails.paymentReferenceNumber =
        paymentFlight.referenceNumber;
      providerDetails.departureDetails.sequence = 1;

      providerDetails.returnDetails.providerReference =
        bookingFlightReturn.providerReference;
      providerDetails.returnDetails.paymentReferenceNumber =
        paymentFlight.referenceNumber;
      providerDetails.returnDetails.sequence = 2;

      const { departureDetails, returnDetails } = providerDetails;

      const [
        newBookingFlightDeparture,
        newBookingFlightReturn,
        mystiflyFlightDetailDeparture,
        mystiflyFlightDetailReturn,
      ] = await Promise.all([
        this.bookingFlightsRepository.create(bookingFlightDeparture),
        this.bookingFlightsRepository.create(bookingFlightReturn),
        this.mystiflyFlightDetailsService.create(departureDetails),
        this.mystiflyFlightDetailsService.create(returnDetails),
      ]);
      newBookingFlights = [newBookingFlightDeparture, newBookingFlightReturn];

      newBookingFlights[0].mystiflyFlightDetail = mystiflyFlightDetailDeparture;
      newBookingFlights[1].mystiflyFlightDetail = mystiflyFlightDetailReturn;

      console.log('newBookingFlights: ', newBookingFlights);
    }

    const transactionFlightsUpdate =
      await this.transactionFlightsService.update({
        id: transactionFlight.id,
        paymentFlight,
        bookingFlights: newBookingFlights,
      });

    console.log('transactionFlightsUpdate: ', transactionFlightsUpdate);

    return {
      departureDetails: newBookingFlights[0],
      returnDetails: newBookingFlights[1],
    };
  }

  async fetchAll() {
    this.loggerService.log('fetchAll...');
    return await this.bookingFlightsRepository.fetchAll();
  }

  async fetchById(id: number) {
    this.loggerService.log('findById...');

    const bookingHotel = await this.bookingFlightsRepository.fetchById(id);
    if (!bookingHotel)
      this.errorHandlerService.notFoundException('Id not found');
    return bookingHotel;
  }

  async update(updateBookingFlightRequestDto: UpdateBookingFlightRequestDto) {
    this.loggerService.log('update...');

    const { id } = updateBookingFlightRequestDto;
    const bookingHotelDB = await this.bookingFlightsRepository.fetchById(id);
    if (!bookingHotelDB)
      this.errorHandlerService.notFoundException('Id not found');

    const bookingFlight = this.classMapper.map(
      updateBookingFlightRequestDto,
      UpdateBookingFlightRequestDto,
      BookingFlight,
    );

    return await this.bookingFlightsRepository.update(bookingFlight);
  }

  async deleteById(id: number) {
    this.loggerService.log('deleteById...');

    const paymentFlight = await this.bookingFlightsRepository.fetchById(id);
    if (!paymentFlight)
      this.errorHandlerService.notFoundException('Id not found');

    const isSuccess = await this.bookingFlightsRepository.deleteById(id);
    if (!isSuccess)
      this.errorHandlerService.internalServerErrorException('Delete failed!');

    return 'Delete successful!';
  }

  async createOneWay(
    createOneWayBookingFlightRequestDto: CreateOneWayBookingFlightRequestDto,
  ) {
    this.loggerService.log('createOneWay...');
    return await this.create(createOneWayBookingFlightRequestDto);
  }

  // async fetchByPaymentReferenceId(id: string) {
  //   this.loggerService.log('fetchByPaymentReferenceId...');

  //   const paymentFlightDB =
  //     await this.paymentFlightsService.fetchByReferenceNumber(id);

  //   return await this.bookingFlightsRepository.fetchByPaymentFlight(
  //     paymentFlightDB,
  //   );
  // }
}
