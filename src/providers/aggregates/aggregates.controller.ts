import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { Public } from '../../auth/decorators/is-public.decorator';
import { MyLoggerService } from '../../utils/my-logger.service';
import { AggregatesService } from './aggregates.service';
import { AirlineAutoSearchRequestDto } from './dtos/request/airline-auto-search-request.dto';
import { AirportAutoSearchRequestDto } from './dtos/request/airport-auto-search-request.dto';
import { TboHotelAutoSearchRequestDto } from './dtos/request/tbo-hotel-auto-search-request.dto';
import { AirportAutoSearchGroupedResponseDto } from './dtos/response/airport-auto-search-grouped-response.dto';

@Controller()
@ApiTags('aggregates')
@ApiBearerAuth('JWT-auth')
export class AggregatesController {
  constructor(
    private readonly aggregatesService: AggregatesService,
    private readonly loggerService: MyLoggerService,
  ) {}

  @Get('tbo-hotels-auto-search')
  @Public()
  async tboHotelAutoSearch(
    @Query() tboHotelAutoSearchRequestDto: TboHotelAutoSearchRequestDto,
  ) {
    this.loggerService.log('tboHotelAutoSearch...');
    return await this.aggregatesService.tboHotelAutoSearch(
      tboHotelAutoSearchRequestDto,
    );
  }

  @Get('airport-auto-search')
  @Public()
  async airportAutoSearch(
    @Query() airportAutoSearchRequestDto: AirportAutoSearchRequestDto,
  ) {
    this.loggerService.log('airportAutoSearch...');
    return await this.aggregatesService.airportAutoSearch(
      airportAutoSearchRequestDto,
    );
  }

  @Get('airline-auto-search')
  @Public()
  async airlineAutoSearch(
    @Query() airlineAutoSearchRequestDto: AirlineAutoSearchRequestDto,
  ) {
    this.loggerService.log('airportAutoSearch...');
    return await this.aggregatesService.airlineAutoSearch(
      airlineAutoSearchRequestDto,
    );
  }

  @Get('airport-auto-search-grouped')
  @Public()
  @ApiOperation({
    summary: 'airport auto search grouped by city name and city code',
  })
  @ApiOkResponse({
    status: 200,
    description: 'ok response',
    type: AirportAutoSearchGroupedResponseDto,
  })
  async airportAutoSearchGrouped(
    @Query() airportAutoSearchRequestDto: AirportAutoSearchRequestDto,
  ): Promise<AirportAutoSearchGroupedResponseDto> {
    this.loggerService.log('airportAutoSearchGrouped...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.aggregatesService.airportAutoSearchGrouped(
        airportAutoSearchRequestDto,
      ),
    };
  }
}
