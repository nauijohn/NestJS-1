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
import { CreateOneWayPrebookingFlightRequestDto } from './dtos/request/create-one-way-prebooking-flight-request.dto';
import { CreatePrebookingFlightRequestDto } from './dtos/request/create-prebooking-flight-request.dto';
import { CreateRoundtripPrebookingFlightRequestDto } from './dtos/request/create-roundtrip-prebooking-flight-request.dto';
import { UpdatePrebookingFlightResponseDto } from './dtos/request/update-prebooking-flight-request.dto';
import { PrebookingFlightsService } from './prebooking-flights.service';

@Controller()
export class PrebookingFlightsController {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly prebookingFlightsService: PrebookingFlightsService,
  ) {}

  @Post()
  async create(
    @Body()
    createPrebookingFlightRequestDto: CreatePrebookingFlightRequestDto,
  ) {
    this.loggerService.log('create...');
    return {
      statusCode: HttpStatus.CREATED,
      data: await this.prebookingFlightsService.create(
        createPrebookingFlightRequestDto,
      ),
    };
  }

  @Post('one-way')
  async createOneWay(
    @Body()
    createOneWayPrebookingFlightRequestDto: CreateOneWayPrebookingFlightRequestDto,
  ) {
    this.loggerService.log('createOneWay...');
    return {
      statusCode: HttpStatus.CREATED,
      data: await this.prebookingFlightsService.createOneWay(
        createOneWayPrebookingFlightRequestDto,
      ),
    };
  }

  @Post('roundtrip')
  async createRoundtrip(
    @Body()
    createRoundtripPrebookingFlightRequestDto: CreateRoundtripPrebookingFlightRequestDto,
  ) {
    this.loggerService.log('createRoundtrip...');
    return {
      statusCode: HttpStatus.CREATED,
      data: await this.prebookingFlightsService.createRoundtrip(
        createRoundtripPrebookingFlightRequestDto,
      ),
    };
  }

  @Get()
  async fetchAll() {
    this.loggerService.log('fetchAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.prebookingFlightsService.fetchAll(),
    };
  }

  @Get(':id')
  async fetchById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('findAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.prebookingFlightsService.fetchById(id),
    };
  }

  @Put()
  async update(
    @Body()
    updatePrebookingFlightResponseDto: UpdatePrebookingFlightResponseDto,
  ) {
    this.loggerService.log('update...');
    if (isNaN(updatePrebookingFlightResponseDto.id))
      this.errorHandlerService.notFoundException('Id not found');
    return {
      statusCode: HttpStatus.OK,
      data: await this.prebookingFlightsService.update(
        updatePrebookingFlightResponseDto,
      ),
    };
  }

  @Delete(':id')
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('deleteById...');
    return {
      statusCode: HttpStatus.OK,
      message: await this.prebookingFlightsService.deleteById(id),
    };
  }
}
