import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { Public } from '../auth/decorators/is-public.decorator';
import { MyLoggerService } from '../utils/my-logger.service';
import { BookHotelsRequestDto } from './dtos/request/book-hotels-request.dto';
import { PreBookHotelsRequestDto } from './dtos/request/prebook-hotels-request.dto';
import { SearchHotelsRequestDto } from './dtos/request/search-hotels-request.dto';
import { PreBookHotelsResponseDto } from './dtos/response/prebook-hotels-response.dto';
import { SearchHotelsResponseDto } from './dtos/response/search-hotels-response.dto';
import { HotelsService } from './hotels.service';

@Controller('hotels')
@ApiTags('hotels')
@ApiBearerAuth('JWT-auth')
export class HotelsController {
  constructor(
    private readonly hotelsService: HotelsService,
    private readonly loggerService: MyLoggerService,
  ) {}

  @Post('search')
  @HttpCode(HttpStatus.OK)
  @Public()
  @ApiOkResponse({ type: SearchHotelsResponseDto })
  async search(
    @Body() searchRequestDto: SearchHotelsRequestDto,
  ): Promise<SearchHotelsResponseDto> {
    this.loggerService.log('search...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.hotelsService.search(searchRequestDto),
    };
  }

  @Post('pre-book')
  @HttpCode(HttpStatus.OK)
  @Public()
  @ApiOkResponse({ type: PreBookHotelsResponseDto })
  async preBook(
    @Body() preBookHotelsRequestDto: PreBookHotelsRequestDto,
  ): Promise<PreBookHotelsResponseDto> {
    this.loggerService.log('preBook...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.hotelsService.preBook(preBookHotelsRequestDto),
    };
  }

  @Post('book')
  @HttpCode(HttpStatus.OK)
  @Public()
  // @ApiOkResponse({ type: PreBookHotelsResponseDto })
  async book(@Body() bookHotelsRequestDto: BookHotelsRequestDto) {
    this.loggerService.log('book...');
    return {
      statusCode: HttpStatus.OK,
      data: await this.hotelsService.book(bookHotelsRequestDto),
    };
  }
}
