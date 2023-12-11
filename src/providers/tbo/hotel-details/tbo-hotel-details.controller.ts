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
import { CreateTboHotelDetailRequestDto } from './dtos/request/create-tbo-hotel-detail-request.dto';
import { UpdateTboHotelDetailRequestDto } from './dtos/request/update-tbo-hotel-detail.request.dto';
import { TboHotelDetailsService } from './tbo-hotel-details.service';

@Controller()
export class TboHotelDetailsController {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly tboHotelDetailsService: TboHotelDetailsService,
  ) {}

  @Post()
  async create(
    @Body()
    createTboHotelDetailRequestDto: CreateTboHotelDetailRequestDto,
  ) {
    this.loggerService.log('create...');
    return {
      statusCode: HttpStatus.CREATED,
      data: await this.tboHotelDetailsService.create(
        createTboHotelDetailRequestDto,
      ),
    };
  }

  @Get()
  async fetchAll() {
    this.loggerService.log('fetchAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.tboHotelDetailsService.fetchAll(),
    };
  }

  @Get(':id')
  async fetchById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('findAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.tboHotelDetailsService.fetchById(id),
    };
  }

  @Put()
  async update(
    @Body()
    updateTboHotelDetailRequestDto: UpdateTboHotelDetailRequestDto,
  ) {
    this.loggerService.log('update...');
    if (isNaN(updateTboHotelDetailRequestDto.id))
      this.errorHandlerService.notFoundException('Id not found');
    return {
      statusCode: HttpStatus.OK,
      data: await this.tboHotelDetailsService.update(
        updateTboHotelDetailRequestDto,
      ),
    };
  }

  @Delete(':id')
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('deleteById...');
    return {
      statusCode: HttpStatus.OK,
      message: await this.tboHotelDetailsService.deleteById(id),
    };
  }
}
