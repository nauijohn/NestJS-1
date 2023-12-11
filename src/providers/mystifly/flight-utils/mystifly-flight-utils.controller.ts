import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiExcludeController, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import {
  Public,
  PublicAccessToken,
  PublicAuthenticated,
} from '../../../auth/decorators/is-public.decorator';
import { MyLoggerService } from '../../../utils/my-logger.service';
import { MystiflyBookRequestDto } from './dtos/request/mystifly-book-request.dto';
import { MystiflyCreateSessionRequestDto } from './dtos/request/mystifly-create-session-request.dto';
import { MystiflyFareRulesRequestDto } from './dtos/request/mystifly-fare-rules-request.dto';
import { MystiflyRevalidationRequestDto } from './dtos/request/mystifly-revalidation-request.dto';
import { MystiflySearchFlightsRequestDto } from './dtos/request/mystifly-search-flights-request.dto';
import { MystiflySearchResponseDto } from './dtos/response/mystifly-search-response.dto';
import { MystiflyFlightUtilsService } from './mystifly-flight-utils.service';

@Controller()
@ApiTags('mystifly')
@ApiExcludeController()
export class MystiflyFlightUtilsController {
  constructor(
    private readonly mystiflyFlightUtilsService: MystiflyFlightUtilsService,
    private readonly loggerService: MyLoggerService,
  ) {}

  @Post('create-session')
  @HttpCode(HttpStatus.OK)
  async createSession(
    @Body() mystiflyCreateSessionRequestDto: MystiflyCreateSessionRequestDto,
  ) {
    this.loggerService.log('createSession...');

    return {
      statusCode: HttpStatus.OK,
      data: await this.mystiflyFlightUtilsService.createSession(
        mystiflyCreateSessionRequestDto,
      ),
    };
  }

  @Post('search')
  @Public()
  @PublicAccessToken()
  @PublicAuthenticated()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    status: 200,
    description: 'sign-in successful',
    type: MystiflySearchResponseDto,
  })
  async searchFlights(
    @Body() searchFlightsRequestDto: MystiflySearchFlightsRequestDto,
  ) {
    this.loggerService.log('searchFlights...');
    return await this.mystiflyFlightUtilsService.search(
      searchFlightsRequestDto,
    );
  }

  @Post('search/raw')
  @Public()
  @PublicAccessToken()
  @PublicAuthenticated()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    status: 200,
    description: 'sign-in successful',
    type: MystiflySearchResponseDto,
  })
  async searchFlightsRaw(
    @Body() searchFlightsRequestDto: MystiflySearchFlightsRequestDto,
  ) {
    this.loggerService.log('searchFlights...');
    return await this.mystiflyFlightUtilsService.searchFlightsRaw(
      searchFlightsRequestDto,
    );
  }

  @Post('fare-rules')
  @HttpCode(HttpStatus.OK)
  async fareRules(@Body() fareRules: MystiflyFareRulesRequestDto) {
    this.loggerService.log('fareRules...');
    return await this.mystiflyFlightUtilsService.fareRules(fareRules);
  }

  @Post('revalidation')
  @HttpCode(HttpStatus.OK)
  async revalidation(
    @Body() revalidationRequestDto: MystiflyRevalidationRequestDto,
  ) {
    this.loggerService.log('revalidation...');
    return await this.mystiflyFlightUtilsService.revalidation(
      revalidationRequestDto,
    );
  }

  @Post('book')
  @HttpCode(HttpStatus.OK)
  async book(@Body() bookRequestDto: MystiflyBookRequestDto) {
    this.loggerService.log('book...');
    return await this.mystiflyFlightUtilsService.book(bookRequestDto);
  }

  @Get('trip-details/:id')
  @HttpCode(HttpStatus.OK)
  async tripDetails(@Param('id') id: string) {
    this.loggerService.log('tripDetails...');
    return await this.mystiflyFlightUtilsService.tripDetails(id);
  }

  @Get('trip-details/v11/:id')
  @HttpCode(HttpStatus.OK)
  async tripDetailsV11(@Param('id') id: string) {
    this.loggerService.log('tripDetailsV11...');
    return await this.mystiflyFlightUtilsService.tripDetailsV11(id);
  }

  @Post('wew')
  async wew(@Body() test: any) {
    return await this.mystiflyFlightUtilsService.wew(test);
  }
}
