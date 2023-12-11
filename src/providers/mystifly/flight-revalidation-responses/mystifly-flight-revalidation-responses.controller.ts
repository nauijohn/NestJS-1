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
import { CreateMystiflyFlightRevalidationResponseRequestDto } from './dtos/request/create-mystifly-flight-revalidation-response-request.dto';
import { UpdateMystiflyFlightRevalidationResponseRequestDto } from './dtos/request/update-mystifly-flight-revalidation-response-request.dto';
import { MystiflyFlightRevalidationResponsesService } from './mystifly-flight-revalidation-responses.service';

@Controller()
export class MystiflyFlightRevalidationResponsesController {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly mystiflyFlightRevalidationResponsesService: MystiflyFlightRevalidationResponsesService,
  ) {}

  @Post()
  async create(
    @Body()
    createMystiflyFlightRevalidationResponseRequestDto: CreateMystiflyFlightRevalidationResponseRequestDto,
  ) {
    this.loggerService.log('create...');
    return {
      statusCode: HttpStatus.CREATED,
      data: await this.mystiflyFlightRevalidationResponsesService.create(
        createMystiflyFlightRevalidationResponseRequestDto,
      ),
    };
  }

  @Get()
  async fetchAll() {
    this.loggerService.log('fetchAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.mystiflyFlightRevalidationResponsesService.fetchAll(),
    };
  }

  @Get('transaction/:id')
  async fetchAllByTransactionFlightId(
    @Param('id', ParseIntPipe) transactionFlightId: number,
  ) {
    this.loggerService.log('fetchAllByTransactionFlightId...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.mystiflyFlightRevalidationResponsesService.fetchAllByTransactionFlightId(
        transactionFlightId,
      ),
    };
  }

  @Get(':id')
  async fetchById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('findAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.mystiflyFlightRevalidationResponsesService.fetchById(id),
    };
  }

  @Put()
  async update(
    @Body()
    updateMystiflyFlightRevalidationResponseRequestDto: UpdateMystiflyFlightRevalidationResponseRequestDto,
  ) {
    this.loggerService.log('update...');
    if (isNaN(updateMystiflyFlightRevalidationResponseRequestDto.id))
      this.errorHandlerService.notFoundException('Id not found');
    return {
      statusCode: HttpStatus.OK,
      data: await this.mystiflyFlightRevalidationResponsesService.update(
        updateMystiflyFlightRevalidationResponseRequestDto,
      ),
    };
  }

  @Delete(':id')
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('deleteById...');
    return {
      statusCode: HttpStatus.OK,
      message: await this.mystiflyFlightRevalidationResponsesService.deleteById(
        id,
      ),
    };
  }
}
