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
import { CustomerFlightDetailsService } from './customer-flight-details.service';
import { CreateCustomerFlightDetailRequestDto } from './dtos/request/create-customer-flight-detail-request.dto';
import { UpdateCustomerFlightDetailRequestDto } from './dtos/request/update-customer-flight-detail-request.dto';

@Controller()
export class CustomerFlightDetailsController {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly customerFlightDetailsService: CustomerFlightDetailsService,
  ) {}

  @Post()
  async create(
    @Body()
    createCustomerFlightDetailRequestDto: CreateCustomerFlightDetailRequestDto,
  ) {
    this.loggerService.log('create...');

    return {
      statusCode: HttpStatus.CREATED,
      data: await this.customerFlightDetailsService.create(
        createCustomerFlightDetailRequestDto,
      ),
    };
  }

  @Get()
  async fetchAll() {
    this.loggerService.log('fetchAll...');

    return {
      statusCode: HttpStatus.OK,
      data: await this.customerFlightDetailsService.fetchAll(),
    };
  }

  @Get('all-details')
  async fetchByAllDetails(
    @Body()
    createCustomerFlightDetailRequestDto: CreateCustomerFlightDetailRequestDto,
  ) {
    this.loggerService.log('fetchByAllDetails...');

    return {
      statusCode: HttpStatus.OK,
      data: await this.customerFlightDetailsService.fetchByAllDetails(
        createCustomerFlightDetailRequestDto,
      ),
    };
  }

  @Get(':id')
  async fetchById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('fetchById...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.customerFlightDetailsService.fetchById(id),
    };
  }

  @Put()
  async update(
    @Body()
    updateCustomerFlightDetailRequestDto: UpdateCustomerFlightDetailRequestDto,
  ) {
    this.loggerService.log('update...');
    if (isNaN(updateCustomerFlightDetailRequestDto.id))
      this.errorHandlerService.notFoundException('Id not found');
    return {
      statusCode: HttpStatus.OK,
      data: await this.customerFlightDetailsService.update(
        updateCustomerFlightDetailRequestDto,
      ),
    };
  }

  @Delete(':id')
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('deleteById...');
    return {
      statusCode: HttpStatus.OK,
      message: await this.customerFlightDetailsService.deleteById(id),
    };
  }
}
