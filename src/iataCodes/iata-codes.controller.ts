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

import { Public } from '../auth/decorators/is-public.decorator';
import { ErrorHandlerService } from '../utils/error-handler.service';
import { MyLoggerService } from '../utils/my-logger.service';
import { CreateIataCodeRequestDto } from './dtos/request/create-iata-code-request.dto';
import { UpdateIataCodeRequestDto } from './dtos/request/update-iata-code-request.dto';
import { IataCodesService } from './iata-codes.service';

@Public()
@Controller('iata-codes')
export class IataCodesController {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly iataCodesService: IataCodesService,
  ) {}

  @Post()
  async create(@Body() createIataCodeRequestDto: CreateIataCodeRequestDto) {
    this.loggerService.log('create...');

    return {
      statusCode: HttpStatus.CREATED,
      data: await this.iataCodesService.create(createIataCodeRequestDto),
    };
  }

  @Get()
  async fetchAll() {
    this.loggerService.log('findAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.iataCodesService.fetchAll(),
    };
  }

  @Get(':id')
  async fetchById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('findAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.iataCodesService.fetchById(id),
    };
  }

  @Put()
  async update(@Body() updateIataCodeRequestDto: UpdateIataCodeRequestDto) {
    this.loggerService.log('update...');
    if (isNaN(updateIataCodeRequestDto.id))
      this.errorHandlerService.notFoundException('Id not found');
    const isSuccess = await this.iataCodesService.update(
      updateIataCodeRequestDto,
    );
    if (!isSuccess)
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Update failed!',
      };
    return {
      statusCode: HttpStatus.OK,
      message: 'Update successful!',
    };
  }

  @Delete(':id')
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('deleteById...');
    const message = await this.iataCodesService.deleteById(id);
    return {
      statusCode: HttpStatus.OK,
      message,
    };
  }
}
