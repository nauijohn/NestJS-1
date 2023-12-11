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
import { CustomerHotelDetailsService } from './customer-hotel-details.service';
import { CreateCustomerHotelDetailRequestDto } from './dtos/request/create-customer-hotel-detail-request.dto';
import { UpdateCustomerHotelDetailRequestDto } from './dtos/request/update-customer-hotel-detail-request.dto';

@Controller()
export class CustomerHotelDetailsController {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly customerHotelDetailsService: CustomerHotelDetailsService,
  ) {}

  @Post()
  async create(
    @Body()
    createCustomerHotelDetailRequestDto: CreateCustomerHotelDetailRequestDto,
  ) {
    this.loggerService.log('create...');
    return {
      statusCode: HttpStatus.CREATED,
      data: await this.customerHotelDetailsService.create(
        createCustomerHotelDetailRequestDto,
      ),
    };
  }

  @Get()
  async fetchAll() {
    this.loggerService.log('fetchAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.customerHotelDetailsService.fetchAll(),
    };
  }

  @Get('all-details')
  async fetchByAllDetails(
    @Body()
    createCustomerHotelDetailRequestDto: CreateCustomerHotelDetailRequestDto,
  ) {
    this.loggerService.log('fetchByAllDetails...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.customerHotelDetailsService.fetchByAllDetails(
        createCustomerHotelDetailRequestDto,
      ),
    };
  }

  @Get(':id')
  async fetchById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('fetchById...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.customerHotelDetailsService.fetchById(id),
    };
  }

  @Put()
  async update(
    @Body()
    updateCustomerHotelDetailRequestDto: UpdateCustomerHotelDetailRequestDto,
  ) {
    this.loggerService.log('update...');
    if (isNaN(updateCustomerHotelDetailRequestDto.id))
      this.errorHandlerService.notFoundException('Id not found');
    return {
      statusCode: HttpStatus.OK,
      data: await this.customerHotelDetailsService.update(
        updateCustomerHotelDetailRequestDto,
      ),
    };
  }

  @Delete(':id')
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('deleteById...');
    return {
      statusCode: HttpStatus.OK,
      message: await this.customerHotelDetailsService.deleteById(id),
    };
  }
}
