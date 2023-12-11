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
import { CreatePassengerDetailRequestDto } from './dtos/request/create-passenger-detail-request.dto';
import { UpdatePassengerDetailRequestDto } from './dtos/request/update-passenger-detail-request.dto';
import { PassengerDetailsService } from './passenger-details.service';

@Controller()
export class PassengerDetailsController {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly passengerDetailsService: PassengerDetailsService,
  ) {}

  @Post()
  async create(
    @Body()
    createPassengerDetailRequestDto: CreatePassengerDetailRequestDto,
  ) {
    this.loggerService.log('create...');
    return {
      statusCode: HttpStatus.CREATED,
      data: await this.passengerDetailsService.create(
        createPassengerDetailRequestDto,
      ),
    };
  }

  @Get()
  async fetchAll() {
    this.loggerService.log('fetchAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.passengerDetailsService.fetchAll(),
    };
  }

  @Get('booking/:id')
  async fetchAllByBookingFlightsId(
    @Param('id', ParseIntPipe) bookingFlightsId: number,
  ) {
    this.loggerService.log('fetchAllByBookingFlightsId...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.passengerDetailsService.fetchAllByBookingFlightsId(
        bookingFlightsId,
      ),
    };
  }

  @Get(':id')
  async fetchById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('fetchById...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.passengerDetailsService.fetchById(id),
    };
  }

  @Put()
  async update(
    @Body()
    updatePassengerDetailRequestDto: UpdatePassengerDetailRequestDto,
  ) {
    this.loggerService.log('update...');
    if (isNaN(updatePassengerDetailRequestDto.id))
      this.errorHandlerService.notFoundException('Id not found');
    return {
      statusCode: HttpStatus.OK,
      data: await this.passengerDetailsService.update(
        updatePassengerDetailRequestDto,
      ),
    };
  }

  @Delete(':id')
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('deleteById...');
    return {
      statusCode: HttpStatus.OK,
      message: await this.passengerDetailsService.deleteById(id),
    };
  }
}
