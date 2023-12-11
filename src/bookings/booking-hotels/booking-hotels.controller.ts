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
import { BookingHotelsService } from './booking-hotels.service';
import { CreateBookingHotelRequestDto } from './dtos/request/create-booking-hotel-request.dto';
import { UpdateBookingHotelRequestDto } from './dtos/request/update-booking-hotel-request.dto';

@Controller()
export class BookingHotelsController {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly bookingHotelsService: BookingHotelsService,
  ) {}

  @Post()
  async create(
    @Body() createBookingHotelRequestDto: CreateBookingHotelRequestDto,
  ) {
    this.loggerService.log('create...');
    return {
      statusCode: HttpStatus.CREATED,
      data: await this.bookingHotelsService.create(
        createBookingHotelRequestDto,
      ),
    };
  }

  @Get()
  async fetchAll() {
    this.loggerService.log('fetchAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.bookingHotelsService.fetchAll(),
    };
  }

  @Get(':id')
  async fetchById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('fetchById...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.bookingHotelsService.fetchById(id),
    };
  }

  @Put()
  async update(
    @Body() updateBookingHotelRequestDto: UpdateBookingHotelRequestDto,
  ) {
    this.loggerService.log('update...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.bookingHotelsService.update(
        updateBookingHotelRequestDto,
      ),
    };
  }

  @Delete(':id')
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('deleteById...');
    return {
      statusCode: HttpStatus.OK,
      message: await this.bookingHotelsService.deleteById(id),
    };
  }
}
