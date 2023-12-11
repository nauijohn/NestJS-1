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

import { Public } from '../../auth/decorators/is-public.decorator';
import { ErrorHandlerService } from '../../utils/error-handler.service';
import { MyLoggerService } from '../../utils/my-logger.service';
import { CreatePricingFlightRequestDto } from './dtos/request/create-pricing-flight-request.dto';
import { UpdatePricingFlightRequestDto } from './dtos/request/update-pricing-flight-request.dto';
import { PricingFlightsService } from './pricing-flights.service';

@Public()
@Controller()
export class PricingFlightsController {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly pricingFlightsService: PricingFlightsService,
  ) {}

  @Post()
  async create(
    @Body() createPricingFlightRequestDto: CreatePricingFlightRequestDto,
  ) {
    this.loggerService.log('create...');

    return {
      statusCode: HttpStatus.CREATED,
      data: await this.pricingFlightsService.create(
        createPricingFlightRequestDto,
      ),
    };
  }

  @Get()
  async fetchAll() {
    this.loggerService.log('findAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.pricingFlightsService.fetchAll(),
    };
  }

  @Get('iata-code')
  async fetchAllByIataCode() {
    this.loggerService.log('fetchAllByIataCode...');

    return {
      statusCode: HttpStatus.OK,
      data: await this.pricingFlightsService.fetchAllByIataCode(),
    };
  }

  @Get('cabin-class-iata-code')
  async fetchAllSortByCabinClassSortByIataCode() {
    this.loggerService.log('fetchAllSortByCabinClassSortByIataCode...');

    return {
      statusCode: HttpStatus.OK,
      data: await this.pricingFlightsService.fetchAllSortByCabinClassSortByIataCode(),
    };
  }

  @Get(':id')
  async fetchById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('findAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.pricingFlightsService.fetchById(id),
    };
  }

  @Put()
  async update(
    @Body() updatePricingFlightRequestDto: UpdatePricingFlightRequestDto,
  ) {
    this.loggerService.log('update...');
    if (isNaN(updatePricingFlightRequestDto.id))
      this.errorHandlerService.notFoundException('Id not found');
    return {
      statusCode: HttpStatus.OK,
      data: await this.pricingFlightsService.update(
        updatePricingFlightRequestDto,
      ),
    };
  }

  @Delete(':id')
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('deleteById...');
    return {
      statusCode: HttpStatus.OK,
      message: await this.pricingFlightsService.deleteById(id),
    };
  }
}
