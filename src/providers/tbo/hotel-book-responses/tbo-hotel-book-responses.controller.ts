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
import { CreateTboHotelBookResponseRequestDto } from './dtos/request/create-tbo-hotel-book-response-request.dto';
import { UpdateTboHotelBookResponseRequestDto } from './dtos/request/update-tbo-hotel-book-response-request.dto';
import { TboHotelBookResponsesService } from './tbo-hotel-book-responses.service';

@Controller()
export class TboHotelBookResponsesController {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly tboHotelBookResponsesService: TboHotelBookResponsesService,
  ) {}

  @Post()
  async create(
    @Body()
    createTboHotelDetailRequestDto: CreateTboHotelBookResponseRequestDto,
  ) {
    this.loggerService.log('create...');
    return {
      statusCode: HttpStatus.CREATED,
      data: await this.tboHotelBookResponsesService.create(
        createTboHotelDetailRequestDto,
      ),
    };
  }

  @Get()
  async fetchAll() {
    this.loggerService.log('fetchAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.tboHotelBookResponsesService.fetchAll(),
    };
  }

  @Get(':id')
  async fetchById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('findAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.tboHotelBookResponsesService.fetchById(id),
    };
  }

  @Put()
  async update(
    @Body()
    updateTboHotelBookResponseRequestDto: UpdateTboHotelBookResponseRequestDto,
  ) {
    this.loggerService.log('update...');
    if (isNaN(updateTboHotelBookResponseRequestDto.id))
      this.errorHandlerService.notFoundException('Id not found');
    return {
      statusCode: HttpStatus.OK,
      data: await this.tboHotelBookResponsesService.update(
        updateTboHotelBookResponseRequestDto,
      ),
    };
  }

  @Delete(':id')
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('deleteById...');
    return {
      statusCode: HttpStatus.OK,
      message: await this.tboHotelBookResponsesService.deleteById(id),
    };
  }
}
