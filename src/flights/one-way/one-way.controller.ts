import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { Public } from '../../auth/decorators/is-public.decorator';
import { MyLoggerService } from '../../utils/my-logger.service';
import { OneWayBookFlightsRequestDto } from './dtos/request/one-way-book-flights-request.dto';
import { OneWayPreBookFlightsRequestDto } from './dtos/request/one-way-pre-book-flights-request.dto';
import { OneWaySearchFlightsRequestDto } from './dtos/request/one-way-search-flights-request.dto';
import { OneWayBookFlightsResponseDto } from './dtos/response/one-way-book-flights-response.dto';
import { OneWayPreBookFlightsResponseDto } from './dtos/response/one-way-pre-book-flights-response.dto';
import { OneWaySearchFlightsResponseDto } from './dtos/response/one-way-search-flights-response.dto';
import { OneWayService } from './one-way.service';

@Controller()
@ApiTags('flights')
@ApiBearerAuth('JWT-auth')
export class OneWayController {
  constructor(
    private readonly oneWayService: OneWayService,
    private readonly loggerService: MyLoggerService,
  ) {}

  @Post('search')
  @HttpCode(HttpStatus.OK)
  @Public()
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'search flights results',
    type: OneWaySearchFlightsResponseDto,
  })
  async search(
    @Body() oneWaySearchFlightsRequestDto: OneWaySearchFlightsRequestDto,
  ): Promise<OneWaySearchFlightsResponseDto> {
    this.loggerService.log('search...');
    const data = await this.oneWayService.search(oneWaySearchFlightsRequestDto);
    return { statusCode: HttpStatus.OK, data };
  }

  @Post('pre-book')
  @HttpCode(HttpStatus.OK)
  @Public()
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'pre-book flights results',
    type: OneWayPreBookFlightsResponseDto,
  })
  async preBook(
    @Body() oneWayPreBookFlightsRequestDto: OneWayPreBookFlightsRequestDto,
  ) {
    this.loggerService.log('preBook...');
    const data = await this.oneWayService.preBook(
      oneWayPreBookFlightsRequestDto,
    );

    return { statusCode: HttpStatus.OK, data };
  }

  @Post('book')
  @HttpCode(HttpStatus.OK)
  @Public()
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'pre-book flights results',
    type: OneWayBookFlightsResponseDto,
  })
  async book(@Body() oneWayBookFlightsRequestDto: OneWayBookFlightsRequestDto) {
    this.loggerService.log('book...');
    const data = await this.oneWayService.book(oneWayBookFlightsRequestDto);

    return { statusCode: HttpStatus.OK, data };
  }
}
