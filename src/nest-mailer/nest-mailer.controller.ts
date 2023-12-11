import { Body, Controller, Post } from '@nestjs/common';

import { MyLoggerService } from '../utils/my-logger.service';
import { FlightsOneWayBookingConfirmationRequestDto } from './dtos/request/flights-one-way-booking-confirmation-request.dto';
import { FlightsRoundtripBookingConfirmationRequestDto } from './dtos/request/flights-roundtrip-booking-confirmation-request.dto';
import { SendEmailRequestDto } from './dtos/request/send-email-request.dto';
import { NestMailerService } from './nest-mailer.service';

@Controller('nest-mailer')
export class NestMailerController {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly nestMailerService: NestMailerService,
  ) {}

  @Post()
  async sendEmail(@Body() sendEmailRequestDto: SendEmailRequestDto) {
    this.loggerService.log('sendEmail...');
    return await this.nestMailerService.sendEmail(sendEmailRequestDto);
  }

  @Post('flights/one-way/booking-confirmation')
  async flightsOneWayBookingConfirmation(
    @Body()
    flightsOneWayBookingConfirmationRequestDto: FlightsOneWayBookingConfirmationRequestDto,
  ) {
    this.loggerService.log('flightsOneWayBookingConfirmation...');
    return await this.nestMailerService.flightsOneWayBookingConfirmation(
      flightsOneWayBookingConfirmationRequestDto,
    );
  }

  @Post('flights/roundtrip/booking-confirmation')
  async flightsRoundtripBookingConfirmation(
    @Body()
    flightsRoundtripBookingConfirmationRequestDto: FlightsRoundtripBookingConfirmationRequestDto,
  ) {
    this.loggerService.log('flightsRoundtripBookingConfirmation...');
    return await this.nestMailerService.flightsRoundtripBookingConfirmation(
      flightsRoundtripBookingConfirmationRequestDto,
    );
  }
}
