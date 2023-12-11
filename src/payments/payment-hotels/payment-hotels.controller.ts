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
import { CreatePaymentHotelsRequestDto } from './dtos/request/create-payment-hotels-request.dto';
import { UpdatePaymentHotelsRequestDto } from './dtos/request/update-payment-hotels-request.dto';
import { PaymentHotelsService } from './payment-hotels.service';

@Controller()
export class PaymentHotelsController {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly paymentHotelsService: PaymentHotelsService,
  ) {}

  @Post()
  async create(
    @Body() createPaymentHotelsRequestDto: CreatePaymentHotelsRequestDto,
  ) {
    this.loggerService.log('create...');

    return {
      statusCode: HttpStatus.CREATED,
      data: await this.paymentHotelsService.create(
        createPaymentHotelsRequestDto,
      ),
    };
  }

  @Get()
  async fetchAll() {
    this.loggerService.log('findAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.paymentHotelsService.fetchAll(),
    };
  }

  @Get(':id')
  async fetchById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('findAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.paymentHotelsService.fetchById(id),
    };
  }

  @Put()
  async update(
    @Body() updatePaymentHotelsRequestDto: UpdatePaymentHotelsRequestDto,
  ) {
    this.loggerService.log('update...');
    if (isNaN(updatePaymentHotelsRequestDto.id))
      this.errorHandlerService.notFoundException('Id not found');
    return {
      statusCode: HttpStatus.OK,
      data: await this.paymentHotelsService.update(
        updatePaymentHotelsRequestDto,
      ),
    };
  }

  @Delete(':id')
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('deleteById...');
    return {
      statusCode: HttpStatus.OK,
      message: await this.paymentHotelsService.deleteById(id),
    };
  }

  @Get('payment-intent/:id')
  async findPaymentIntentById(@Param('id') id: string) {
    this.loggerService.log('getPaymentIntentById...');

    return {
      statusCode: HttpStatus.OK,
      data: await this.paymentHotelsService.findPaymentIntentById(id),
    };
  }

  @Put('status/paid/:paymentIntentId')
  async updateStatusToPaidByPaymentIntentId(
    @Param('paymentIntentId') paymentIntentId: string,
  ) {
    this.loggerService.log('updateStatusToPaidByPaymentIntentId...');

    const isSuccess =
      await this.paymentHotelsService.updateStatusToPaidByPaymentIntentId(
        paymentIntentId,
      );

    return {
      statusCode: isSuccess ? HttpStatus.OK : HttpStatus.INTERNAL_SERVER_ERROR,
      message: isSuccess
        ? 'Update to Paid status successful!'
        : 'Update to Paid status failed!',
    };
  }
}
