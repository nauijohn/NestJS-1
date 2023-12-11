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
import { ApiExcludeController, ApiTags } from '@nestjs/swagger';

import { ErrorHandlerService } from '../../../utils/error-handler.service';
import { MyLoggerService } from '../../../utils/my-logger.service';
import { CreateMystiflyFlightDetailRequestDto } from './dtos/request/create-mystifly-flight-detail-request.dto';
import { UpdateMystiflyFlightDetailRequestDto } from './dtos/request/update-mystifly-flight-detail-request.dto';
import { MystiflyFlightDetailsService } from './mystifly-flight-details.service';

@Controller()
@ApiTags('mystifly')
@ApiExcludeController()
export class MystiflyFlightDetailsController {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly mystiflyFlightDetailsService: MystiflyFlightDetailsService,
  ) {}

  @Post()
  async create(
    @Body()
    createMystiflyFlightDetailRequestDto: CreateMystiflyFlightDetailRequestDto,
  ) {
    this.loggerService.log('create...');
    return {
      statusCode: HttpStatus.CREATED,
      data: await this.mystiflyFlightDetailsService.create(
        createMystiflyFlightDetailRequestDto,
      ),
    };
  }

  @Get()
  async fetchAll() {
    this.loggerService.log('findAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.mystiflyFlightDetailsService.fetchAll(),
    };
  }

  @Get('privder-reference/:id')
  async fetchByProviderReference(@Param('id') providerReference: string) {
    this.loggerService.log('findAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.mystiflyFlightDetailsService.fetchByProviderReference(
        providerReference,
      ),
    };
  }

  @Get('payment-reference/:id')
  async fetchByPaymentReference(@Param('id') paymentReference: string) {
    this.loggerService.log('findAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.mystiflyFlightDetailsService.fetchByPaymentReference(
        paymentReference,
      ),
    };
  }

  @Get(':id')
  async fetchById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('findAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.mystiflyFlightDetailsService.fetchById(id),
    };
  }

  @Put()
  async update(
    @Body()
    updateMystiflyFlightDetailRequestDto: UpdateMystiflyFlightDetailRequestDto,
  ) {
    this.loggerService.log('update...');
    if (isNaN(updateMystiflyFlightDetailRequestDto.id))
      this.errorHandlerService.notFoundException('Id not found');
    return {
      statusCode: HttpStatus.OK,
      data: await this.mystiflyFlightDetailsService.update(
        updateMystiflyFlightDetailRequestDto,
      ),
    };
  }

  @Delete(':id')
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('deleteById...');
    return {
      statusCode: HttpStatus.OK,
      message: await this.mystiflyFlightDetailsService.deleteById(id),
    };
  }
}
