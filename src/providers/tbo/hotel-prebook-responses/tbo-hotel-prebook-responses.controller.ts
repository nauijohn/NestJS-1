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
import { CreateTboHotelPrebookResponseRequestDto } from './dtos/request/create-tbo-hotel-prebook-response-request.dto';
import { UpdateTboHotelPrebookResponseRequestDto } from './dtos/request/update-tbo-hotel-prebook-response-request.dto';
import { TboHotelPrebookResponsesService } from './tbo-hotel-prebook-responses.service';

@Controller()
export class TboHotelPrebookResponsesController {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly tboHotelPrebookResponsesService: TboHotelPrebookResponsesService,
  ) {}

  @Post()
  async create(
    @Body()
    createTboHotelPrebookResponseRequestDto: CreateTboHotelPrebookResponseRequestDto,
  ) {
    this.loggerService.log('create...');
    return {
      statusCode: HttpStatus.CREATED,
      data: await this.tboHotelPrebookResponsesService.create(
        createTboHotelPrebookResponseRequestDto,
      ),
    };
  }

  @Get()
  async fetchAll() {
    this.loggerService.log('fetchAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.tboHotelPrebookResponsesService.fetchAll(),
    };
  }

  @Get(':id')
  async fetchById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('findAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.tboHotelPrebookResponsesService.fetchById(id),
    };
  }

  @Put()
  async update(
    @Body()
    updateTboHotelPrebookResponseRequestDto: UpdateTboHotelPrebookResponseRequestDto,
  ) {
    this.loggerService.log('update...');
    if (isNaN(updateTboHotelPrebookResponseRequestDto.id))
      this.errorHandlerService.notFoundException('Id not found');
    return {
      statusCode: HttpStatus.OK,
      data: await this.tboHotelPrebookResponsesService.update(
        updateTboHotelPrebookResponseRequestDto,
      ),
    };
  }

  @Delete(':id')
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('deleteById...');
    return {
      statusCode: HttpStatus.OK,
      message: await this.tboHotelPrebookResponsesService.deleteById(id),
    };
  }
}
