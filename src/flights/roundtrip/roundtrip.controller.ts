import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { Public } from '../../auth/decorators/is-public.decorator';
import { MyLoggerService } from '../../utils/my-logger.service';
import { RoundtripBookFlightsRequestDto } from './dtos/request/roundtrip-book-flights-request.dto';
import { RoundtripPreBookFlightsRequestDto } from './dtos/request/roundtrip-pre-book-flights-request.dto';
import { RoundtripSearchFlightsRequestDto } from './dtos/request/roundtrip-search-flights-request.dto';
import { RoundtripSearchFlightsResponseDto } from './dtos/response/roundtrip-search-flights-response.dto';
import { RoundtripService } from './roundtrip.service';

@Controller()
@ApiTags('flights')
@ApiBearerAuth('JWT-auth')
export class RoundtripController {
  constructor(
    private readonly rountripService: RoundtripService,
    private readonly loggerService: MyLoggerService,
  ) {}

  @Post('search')
  @HttpCode(HttpStatus.OK)
  @Public()
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'search flights results',
    type: RoundtripSearchFlightsResponseDto,
  })
  async search(
    @Body() roundtripSearchFlightsRequestDto: RoundtripSearchFlightsRequestDto,
  ): Promise<RoundtripSearchFlightsResponseDto> {
    this.loggerService.log('search...');
    const data = await this.rountripService.search(
      roundtripSearchFlightsRequestDto,
    );
    return { statusCode: HttpStatus.OK, data };
  }

  @Post('pre-book')
  @HttpCode(HttpStatus.OK)
  @Public()
  // @ApiOkResponse({
  //   status: HttpStatus.OK,
  //   description: 'pre-book flights results',
  //   type: OneWayPreBookFlightsResponseDto,
  // })
  async preBook(
    @Body()
    roundtripPreBookFlightsRequestDto: RoundtripPreBookFlightsRequestDto,
  ) {
    this.loggerService.log('preBook...');
    const data = await this.rountripService.preBook(
      roundtripPreBookFlightsRequestDto,
    );

    return { statusCode: HttpStatus.OK, data };
  }

  @Post('book')
  @HttpCode(HttpStatus.OK)
  @Public()
  // @ApiOkResponse({
  //   status: HttpStatus.OK,
  //   description: 'pre-book flights results',
  //   type: OneWayBookFlightsResponseDto,
  // })
  async book(
    @Body() roundtripBookFlightsRequestDto: RoundtripBookFlightsRequestDto,
  ) {
    this.loggerService.log('book...');
    const data = await this.rountripService.book(
      roundtripBookFlightsRequestDto,
    );

    return { statusCode: HttpStatus.OK, data };
  }
}
