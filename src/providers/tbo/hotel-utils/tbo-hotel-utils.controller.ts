import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { MyLoggerService } from '../../../utils/my-logger.service';
import { TboCitiesResponseDto } from './dtos/response/tbo-cities-response.dto';
import { TboCountriesResponseDto } from './dtos/response/tbo-countries-response.dto';
import { TboHotelUtilsService } from './tbo-hotel-utils.service';

@Controller()
@ApiTags('tbo')
@ApiBearerAuth('JWT-auth')
export class TboHotelUtilsController {
  constructor(
    private readonly tboService: TboHotelUtilsService,
    private readonly loggerService: MyLoggerService,
  ) {}

  @Get('countries')
  @ApiOkResponse({ type: TboCountriesResponseDto })
  async fetchCountries() {
    this.loggerService.log('fetchCountries...');
    return await this.tboService.fetchCountries();
  }

  @Get(':countryCode/cities')
  @ApiOkResponse({ type: TboCitiesResponseDto })
  async fetchCitiesOfCountry(@Param('countryCode') countryCode: string) {
    this.loggerService.log('fetchCitiesOfCountry...');
    return await this.tboService.fetchCitiesOfCountry(countryCode);
  }
}
