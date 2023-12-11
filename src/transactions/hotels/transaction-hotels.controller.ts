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
import { CreateTransactionHotelRequestDto } from './dtos/request/create-transaction-hotel-request.dto';
import { UpdateTransactionHotelRequestDto } from './dtos/request/update-transaction-hotel-request.dto';
import { TransactionHotelsService } from './transaction-hotels.service';

@Controller()
export class TransactionHotelsController {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly transactionHotelsService: TransactionHotelsService,
  ) {}

  @Post()
  async create(
    @Body() createTransactionHotelRequestDto: CreateTransactionHotelRequestDto,
  ) {
    this.loggerService.log('create...');
    return {
      statusCode: HttpStatus.CREATED,
      data: await this.transactionHotelsService.create(
        createTransactionHotelRequestDto,
      ),
    };
  }

  @Get()
  async fetchAll() {
    this.loggerService.log('fetchAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.transactionHotelsService.fetchAll(),
    };
  }

  @Get(':id')
  async fetchById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('fetchById...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.transactionHotelsService.fetchById(id),
    };
  }

  @Put()
  async update(
    @Body() updateTransactionHotelRequestDto: UpdateTransactionHotelRequestDto,
  ) {
    this.loggerService.log('update...');
    if (isNaN(updateTransactionHotelRequestDto.id))
      this.errorHandlerService.notFoundException('Id not found');
    return {
      statusCode: HttpStatus.OK,
      data: await this.transactionHotelsService.update(
        updateTransactionHotelRequestDto,
      ),
    };
  }

  @Delete(':id')
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('deleteById...');
    return {
      statusCode: HttpStatus.OK,
      message: await this.transactionHotelsService.deleteById(id),
    };
  }
}
