import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';

import { ErrorHandlerService } from '../../utils/error-handler.service';
import { MyLoggerService } from '../../utils/my-logger.service';
import { BookingFlightsService } from './booking-flights.service';
import { CreateBookingFlightRequestDto } from './dtos/request/create-booking-flight-request.dto';
import { CreateOneWayBookingFlightRequestDto } from './dtos/request/create-one-way-booking-flight-request.dto';
import { CreateRoundtripBookingFlightRequestDto } from './dtos/request/create-roundtrip-booking-flight-request.dto';
import { UpdateBookingFlightRequestDto } from './dtos/request/update-booking-flight-request.dto';

@Controller()
export class BookingFlightsController {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly bookingFlightsService: BookingFlightsService,
  ) {}

  @Post()
  async create(
    @Body() createBookingFlightRequestDto: CreateBookingFlightRequestDto,
  ) {
    this.loggerService.log('create...');
    return {
      statusCode: HttpStatus.CREATED,
      data: await this.bookingFlightsService.create(
        createBookingFlightRequestDto,
      ),
    };
  }

  @Post('one-way')
  async createOneWay(
    @Body()
    createOneWayBookingFlightRequestDto: CreateOneWayBookingFlightRequestDto,
  ) {
    this.loggerService.log('create...');

    return {
      statusCode: HttpStatus.CREATED,
      data: await this.bookingFlightsService.createOneWay(
        createOneWayBookingFlightRequestDto,
      ),
    };
  }

  @Post('roundtrip')
  async createRoundtrip(
    @Body()
    createRoundtripBookingFlightRequestDto: CreateRoundtripBookingFlightRequestDto,
  ) {
    this.loggerService.log('create...');

    return {
      statusCode: HttpStatus.CREATED,
      data: await this.bookingFlightsService.createRoundtrip(
        createRoundtripBookingFlightRequestDto,
      ),
    };
  }

  @Get()
  async fetchAll() {
    this.loggerService.log('fetchAll...');

    return {
      statusCode: HttpStatus.OK,
      data: await this.bookingFlightsService.fetchAll(),
    };
  }

  // @Get('payment-reference/:id')
  // async fetchByPaymentReferenceId(@Param('id') id: string) {
  //   this.loggerService.log('fetchByPaymentReferenceId...');
  //   return {
  //     statusCode: HttpStatus.OK,
  //     data: await this.bookingFlightsService.fetchByPaymentReferenceId(id),
  //   };
  // }

  // @Get('payment-intent/:id')
  // async fetchAllByPaymentIntentId(@Param('id') paymentIntentId: string) {
  //   this.loggerService.log('fetchAllByPaymentIntentId...');
  //   return {
  //     statusCode: HttpStatus.OK,
  //     data: await this.bookingFlightsService.fetchAllByPaymentIntentId(
  //       paymentIntentId,
  //     ),
  //   };
  // }

  @Get(':id')
  async fetchById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('fetchById...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.bookingFlightsService.fetchById(id),
    };
  }

  @Put()
  async update(
    @Body() updateBookingFlightRequestDto: UpdateBookingFlightRequestDto,
  ) {
    this.loggerService.log('update...');
    if (isNaN(updateBookingFlightRequestDto.id))
      this.errorHandlerService.notFoundException('Id not found');
    return {
      statusCode: HttpStatus.OK,
      data: await this.bookingFlightsService.update(
        updateBookingFlightRequestDto,
      ),
    };
  }

  @Delete(':id')
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('deleteById...');
    return {
      statusCode: HttpStatus.OK,
      message: await this.bookingFlightsService.deleteById(id),
    };
  }
}
