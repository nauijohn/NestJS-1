import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { MyLoggerService } from '../../../utils/my-logger.service';
import { AmadeusFlightsService } from './amadeus-flights.service';
import { AmadeusFlightsSearchRequestDto } from './dtos/request/amadeus-flights-search-request.dto';

@Controller()
@ApiTags('amadeus')
export class AmadeusFlightsController {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly amadeusFlightsService: AmadeusFlightsService,
  ) {}

  @Post('search')
  async search(
    @Body() amadeusFlightsSearchRequestDto: AmadeusFlightsSearchRequestDto,
  ) {
    this.loggerService.log('search...');
    return await this.amadeusFlightsService.search(
      amadeusFlightsSearchRequestDto,
    );
  }

  @Post('pricing')
  async pricing(@Body() amadeusFlightsPricingRequestDto: any) {
    this.loggerService.log('pricing...');

    return await this.amadeusFlightsService.pricing(
      amadeusFlightsPricingRequestDto,
    );
  }

  @Post('order')
  async order(@Body() amadeusFlightsOrderRequestDto: any) {
    this.loggerService.log('order...');

    return await this.amadeusFlightsService.order(
      amadeusFlightsOrderRequestDto,
    );
  }

  @Get('order-management/:id')
  async orderManagement(@Param('id') id: string) {
    this.loggerService.log('orderManagement...');

    return await this.amadeusFlightsService.orderManagement(id);
  }
}
