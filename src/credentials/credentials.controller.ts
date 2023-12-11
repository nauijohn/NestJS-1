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
import { CredentialsService } from './credentials.service';
import { CreateCredentialRequestDto } from './dtos/request/create-credential-request.dto';
import { UpdateCredentialRequestDto } from './dtos/request/update-credential-request.dto';
import { Providers } from './providers.enum';

@Public()
@Controller('credentials')
export class CredentialsController {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly credentialsService: CredentialsService,
  ) {}

  @Post()
  async create(@Body() createCredentialRequestDto: CreateCredentialRequestDto) {
    this.loggerService.log('create...');
    return {
      statusCode: HttpStatus.CREATED,
      data: await this.credentialsService.create(createCredentialRequestDto),
    };
  }

  @Get()
  async fetchAll() {
    this.loggerService.log('fetchAll...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.credentialsService.fetchAll(),
    };
  }

  @Get('provider/:provider')
  async fetchByProvider(@Param('provider') provider: Providers) {
    this.loggerService.log('fetchByProvider...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.credentialsService.fetchByProvider(provider),
    };
  }

  @Get(':id')
  async fetchById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('fetchById...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.credentialsService.fetchById(id),
    };
  }

  @Put()
  async update(@Body() updateCredentialRequestDto: UpdateCredentialRequestDto) {
    this.loggerService.log('update...');
    if (isNaN(updateCredentialRequestDto.id))
      this.errorHandlerService.notFoundException('Id not found');
    const isSuccess = await this.credentialsService.update(
      updateCredentialRequestDto,
    );
    return {
      statusCode: isSuccess ? HttpStatus.OK : HttpStatus.INTERNAL_SERVER_ERROR,
      message: isSuccess ? 'Update successful!' : 'Update failed!',
    };
  }

  @Delete(':id')
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    this.loggerService.log('deleteById...');
    return {
      statusCode: HttpStatus.OK,
      message: await this.credentialsService.deleteById(id),
    };
  }
}
