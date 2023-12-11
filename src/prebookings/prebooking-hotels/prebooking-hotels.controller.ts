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
import { CreatePrebookingHotelRequestDto } from './dtos/request/create-prebooking-hotel-request.dto';
import { UpdatePrebookingHotelRequestDto } from './dtos/request/update-prebooking-hotel-request.dto';
import { PrebookingHotelsService } from './prebooking-hotels.service';

@Controller()
export class PrebookingHotelsController {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly prebookingHotelsService: PrebookingHotelsService,
  ) {}

  @Post()
  async create(
    @Body()
    createPrebookingHotelRequestDto: CreatePrebookingHotelRequestDto,
  ) {
    this.loggerService.log('create...');
    return {
      statusCode: HttpStatus.CREATED,
      data: await this.prebookingHotelsService.create(
        createPrebookingHotelRequestDto,
      ),
    };
  }

  @Get()
  async fetchAll() {
    this.loggerService.log('fetchAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.prebookingHotelsService.fetchAll(),
    };
  }

  @Get(':id')
  async fetchById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('findAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.prebookingHotelsService.fetchById(id),
    };
  }

  @Put()
  async update(
    @Body()
    updatePrebookingHotelRequestDto: UpdatePrebookingHotelRequestDto,
  ) {
    this.loggerService.log('update...');
    if (isNaN(updatePrebookingHotelRequestDto.id))
      this.errorHandlerService.notFoundException('Id not found');
    return {
      statusCode: HttpStatus.OK,
      data: await this.prebookingHotelsService.update(
        updatePrebookingHotelRequestDto,
      ),
    };
  }

  @Delete(':id')
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('deleteById...');
    return {
      statusCode: HttpStatus.OK,
      message: await this.prebookingHotelsService.deleteById(id),
    };
  }
}
