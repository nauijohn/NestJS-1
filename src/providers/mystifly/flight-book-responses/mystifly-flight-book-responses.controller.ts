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
import { CreateMystiflyFlightBookResponseRequestDto } from './dtos/request/create-mystifly-flight-book-response-request.dto';
import { UpdateMystiflyFlightBookResponseRequestDto } from './dtos/request/update-mystifly-flight-book-response-request.dto';
import { MystiflyFlightBookResponsesService } from './mystifly-flight-book-responses.service';

@Controller()
export class MystiflyFlightBookResponsesController {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly mystiflyFlightBookResponsesService: MystiflyFlightBookResponsesService,
  ) {}

  @Post()
  async create(
    @Body()
    createMystiflyFlightDetailRequestDto: CreateMystiflyFlightBookResponseRequestDto,
  ) {
    this.loggerService.log('create...');
    return {
      statusCode: HttpStatus.CREATED,
      data: await this.mystiflyFlightBookResponsesService.create(
        createMystiflyFlightDetailRequestDto,
      ),
    };
  }

  @Get()
  async fetchAll() {
    this.loggerService.log('fetchAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.mystiflyFlightBookResponsesService.fetchAll(),
    };
  }

  @Get(':id')
  async fetchById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('findAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.mystiflyFlightBookResponsesService.fetchById(id),
    };
  }

  @Put()
  async update(
    @Body()
    updateMystiflyFlightBookResponseRequestDto: UpdateMystiflyFlightBookResponseRequestDto,
  ) {
    this.loggerService.log('update...');
    if (isNaN(updateMystiflyFlightBookResponseRequestDto.id))
      this.errorHandlerService.notFoundException('Id not found');
    return {
      statusCode: HttpStatus.OK,
      data: await this.mystiflyFlightBookResponsesService.update(
        updateMystiflyFlightBookResponseRequestDto,
      ),
    };
  }

  @Delete(':id')
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('deleteById...');
    return {
      statusCode: HttpStatus.OK,
      message: await this.mystiflyFlightBookResponsesService.deleteById(id),
    };
  }
}
