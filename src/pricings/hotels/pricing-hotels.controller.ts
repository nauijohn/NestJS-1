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
import { CreatePricingHotelRequestDto } from './dtos/request/create-pricing-hotel-request.dto';
import { UpdatePricingHotelRequestDto } from './dtos/request/update-pricing-hotel-request.dto';
import { PricingHotelsService } from './pricing-hotels.service';

@Public()
@Controller()
export class PricingHotelsController {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly pricingHotelsService: PricingHotelsService,
  ) {}

  @Post()
  async create(
    @Body() createPricingHotelRequestDto: CreatePricingHotelRequestDto,
  ) {
    this.loggerService.log('create...');

    return {
      statusCode: HttpStatus.CREATED,
      data: await this.pricingHotelsService.create(
        createPricingHotelRequestDto,
      ),
    };
  }

  @Get()
  async fetchAll() {
    this.loggerService.log('findAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.pricingHotelsService.fetchAll(),
    };
  }

  @Get(':id')
  async fetchById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('findAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.pricingHotelsService.fetchById(id),
    };
  }

  @Put()
  async update(
    @Body() updatePricingHotelRequestDto: UpdatePricingHotelRequestDto,
  ) {
    this.loggerService.log('update...');
    if (isNaN(updatePricingHotelRequestDto.id))
      this.errorHandlerService.notFoundException('Id not found');
    return {
      statusCode: HttpStatus.OK,
      data: await this.pricingHotelsService.update(
        updatePricingHotelRequestDto,
      ),
    };
  }

  @Delete(':id')
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('deleteById...');
    return {
      statusCode: HttpStatus.OK,
      message: await this.pricingHotelsService.deleteById(id),
    };
  }
}
