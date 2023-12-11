import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Public } from '../../../auth/decorators/is-public.decorator';
import { MyLoggerService } from '../../../utils/my-logger.service';
import { TripninjaFlightsGenerateSolutionsRequestDto } from './dtos/request/tripninja-flights-generate-solutions-request.dto';
import { TripninjaFlightsParseAmadeusRequestDto } from './dtos/request/tripninja-flights-parse-amadeus-request.dto';
import { TripninjaFlightsSearchRequestDto } from './dtos/request/tripninja-flights-search-request.dto';
import { TripninjaFlightsService } from './tripninja-flights.service';

@Controller()
@ApiTags('tripninja')
export class TripninjaFlightsController {
  constructor(
    private readonly tripninjaFlightsService: TripninjaFlightsService,
    private readonly loggerService: MyLoggerService,
  ) {}

  @Public()
  @Post('search')
  async search(
    @Body() tripninjaFlightsSearchRequestDto: TripninjaFlightsSearchRequestDto,
  ) {
    this.loggerService.log('search...');
    return await this.tripninjaFlightsService.search(
      tripninjaFlightsSearchRequestDto,
    );
  }

  @Public()
  @Post('parse-search-results')
  async parseSearchResults(
    @Body()
    tripninjaFlightsParseAmadeusRequestDto: TripninjaFlightsParseAmadeusRequestDto,
  ) {
    this.loggerService.log('parseSearchResults...');
    return await this.tripninjaFlightsService.parseSearchResults(
      tripninjaFlightsParseAmadeusRequestDto,
    );
  }

  @Public()
  @Post('generate-solutions')
  async generateSolutions(
    @Body()
    tripninjaFlightsGenerateSolutionsRequestDto: TripninjaFlightsGenerateSolutionsRequestDto,
  ) {
    this.loggerService.log('generateSolutions...');
    return await this.tripninjaFlightsService.generateSolutions(
      tripninjaFlightsGenerateSolutionsRequestDto,
    );
  }
}
