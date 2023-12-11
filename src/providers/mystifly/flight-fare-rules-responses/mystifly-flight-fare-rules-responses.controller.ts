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

import { ErrorHandlerService } from '../../../utils/error-handler.service';
import { MyLoggerService } from '../../../utils/my-logger.service';
import { CreateMystiflyFlightFareRulesResponseRequestDto } from './dtos/request/create-mystifly-flight-fare-rules-response-request.dto';
import { CreateMystiflyFlightRoundtripFareRulesResponseRequestDto } from './dtos/request/create-mystifly-flight-roundtrip-fare-rules-response-request.dto';
import { UpdateMystiflyFlightFareRulesResponseRequestDto } from './dtos/request/update-mystifly-flight-fare-rules-response-request.dto';
import { MystiflyFlightFareRulesResponsesService } from './mystifly-flight-fare-rules-responses.service';

@Controller()
export class MystiflyFlightFareRulesResponsesController {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly mystiflyFlightFareRulesResponsesService: MystiflyFlightFareRulesResponsesService,
  ) {}

  @Post()
  async create(
    @Body()
    createMystiflyFlightDetailRequestDto: CreateMystiflyFlightFareRulesResponseRequestDto,
  ) {
    this.loggerService.log('create...');
    return {
      statusCode: HttpStatus.CREATED,
      data: await this.mystiflyFlightFareRulesResponsesService.create(
        createMystiflyFlightDetailRequestDto,
      ),
    };
  }

  @Post('one-way')
  async createOneWay(
    @Body()
    createMystiflyFlightDetailRequestDto: CreateMystiflyFlightFareRulesResponseRequestDto,
  ) {
    this.loggerService.log('createOneWay...');
    return {
      statusCode: HttpStatus.CREATED,
      data: await this.mystiflyFlightFareRulesResponsesService.createOneWay(
        createMystiflyFlightDetailRequestDto,
      ),
    };
  }

  @Post('roundtrip')
  async createRoundtrip(
    @Body()
    createMystiflyFlightRoundtripFareRulesResponseRequestDto: CreateMystiflyFlightRoundtripFareRulesResponseRequestDto,
  ) {
    this.loggerService.log('createRoundtrip...');
    return {
      statusCode: HttpStatus.CREATED,
      data: await this.mystiflyFlightFareRulesResponsesService.createRoundtrip(
        createMystiflyFlightRoundtripFareRulesResponseRequestDto,
      ),
    };
  }

  @Get()
  async fetchAll() {
    this.loggerService.log('fetchAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.mystiflyFlightFareRulesResponsesService.fetchAll(),
    };
  }

  @Get(':id')
  async fetchById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('findAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.mystiflyFlightFareRulesResponsesService.fetchById(id),
    };
  }

  @Put()
  async update(
    @Body()
    updateMystiflyFlightFareRulesResponseRequestDto: UpdateMystiflyFlightFareRulesResponseRequestDto,
  ) {
    this.loggerService.log('update...');
    if (isNaN(updateMystiflyFlightFareRulesResponseRequestDto.id))
      this.errorHandlerService.notFoundException('Id not found');
    return {
      statusCode: HttpStatus.OK,
      data: await this.mystiflyFlightFareRulesResponsesService.update(
        updateMystiflyFlightFareRulesResponseRequestDto,
      ),
    };
  }

  @Delete(':id')
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('deleteById...');
    return {
      statusCode: HttpStatus.OK,
      message: await this.mystiflyFlightFareRulesResponsesService.deleteById(
        id,
      ),
    };
  }
}
