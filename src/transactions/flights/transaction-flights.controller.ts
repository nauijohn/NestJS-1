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
import { CreateTransactionFlightRequestDto } from './dtos/request/create-transaction-flight-request.dto';
import { UpdateTransactionFlightRequestDto } from './dtos/request/update-transaction-flight-request.dto';
import { TransactionFlightsService } from './transaction-flights.service';

@Controller()
export class TransactionFlightsController {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly transactionFlightsService: TransactionFlightsService,
  ) {}

  @Post()
  async create(
    @Body()
    createTransactionFlightRequestDto: CreateTransactionFlightRequestDto,
  ) {
    this.loggerService.log('create...');

    return {
      statusCode: HttpStatus.CREATED,
      data: await this.transactionFlightsService.create(
        createTransactionFlightRequestDto,
      ),
    };
  }

  @Get()
  async fetchAll() {
    this.loggerService.log('fetchAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.transactionFlightsService.fetchAll(),
    };
  }

  @Get(':id')
  async fetchById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('fetchById...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.transactionFlightsService.fetchById(id),
    };
  }

  @Get('payment-reference/:id')
  async fetchByPaymentReferenceNumber(@Param('id') id: string) {
    this.loggerService.log('fetchByPaymentReferenceNumber...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.transactionFlightsService.fetchByPaymentReferenceNumber(
        id,
      ),
    };
  }

  @Get('payment-intent/:id')
  async fetchByPaymentIntentId(@Param('id') id: string) {
    this.loggerService.log('fetchByPaymentIntentId...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.transactionFlightsService.fetchByPaymentIntentId(id),
    };
  }

  @Put()
  async update(
    @Body()
    updateTransactionFlightRequestDto: UpdateTransactionFlightRequestDto,
  ) {
    this.loggerService.log('update...');
    if (isNaN(updateTransactionFlightRequestDto.id))
      this.errorHandlerService.notFoundException('Id not found');
    return {
      statusCode: HttpStatus.OK,
      data: await this.transactionFlightsService.update(
        updateTransactionFlightRequestDto,
      ),
    };
  }

  @Delete(':id')
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('deleteById...');
    return {
      statusCode: HttpStatus.OK,
      message: await this.transactionFlightsService.deleteById(id),
    };
  }
}
