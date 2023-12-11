import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiExcludeController, ApiTags } from '@nestjs/swagger';

import { MyLoggerService } from '../../../../utils/my-logger.service';
import { TboBookRequestDto } from './dtos/request/tbo-book-request.dto';
import { TboPreBookRequestDto } from './dtos/request/tbo-pre-book-request.dto';
import { TboSearchHotelsRequestDto } from './dtos/request/tbo-search-hotels-request.dto';
import { TboHotelsService } from './tbo-hotels.service';

@Controller()
@ApiTags('tbo')
@ApiExcludeController()
export class TboHotelsController {
  constructor(
    private readonly tboHotelsService: TboHotelsService,
    private readonly loggerService: MyLoggerService,
  ) {}

  @Post('search')
  async search(@Body() searchHotelsRequestDto: TboSearchHotelsRequestDto) {
    this.loggerService.log('search...');
    return await this.tboHotelsService.search(searchHotelsRequestDto);
  }

  @Post('pre-book')
  async preBook(@Body() preBookRequestDto: TboPreBookRequestDto) {
    this.loggerService.log('preBook...');
    return await this.tboHotelsService.preBook(preBookRequestDto);
  }

  @Post('book')
  async book(@Body() tbobookRequestDto: TboBookRequestDto) {
    this.loggerService.log('book...');
    return await this.tboHotelsService.book(tbobookRequestDto);
  }

  @Get()
  async fetchCodes() {
    this.loggerService.log('fetchCodes...');
    return await this.tboHotelsService.fetchCodes();
  }

  @Get(':cityCode')
  async fetchHotelCodesByCityCode(@Param('cityCode') cityCode: string) {
    this.loggerService.log('fetchHotelCodesByCityCode...');
    return await this.tboHotelsService.fetchHotelCodesByCityCode(cityCode);
  }

  @Post('details')
  async fetchHotelDetails(@Body('Hotelcodes') Hotelcodes: string) {
    this.loggerService.log('fetchHotelDetails...');
    return await this.tboHotelsService.fetchHotelDetails(Hotelcodes);
  }
}
