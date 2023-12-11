import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MyLoggerService } from '../utils/my-logger.service';
import { FlightsOneWayBookingConfirmationRequestDto } from './dtos/request/flights-one-way-booking-confirmation-request.dto';
import { FlightsRoundtripBookingConfirmationRequestDto } from './dtos/request/flights-roundtrip-booking-confirmation-request.dto';
import { SendEmailRequestDto } from './dtos/request/send-email-request.dto';

@Injectable()
export class NestMailerService {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendEmail(sendEmailRequestDto: SendEmailRequestDto) {
    this.loggerService.log('sendEmail...');

    const { to } = sendEmailRequestDto;

    const attachmentPath = `${__dirname.replace(
      'nest-mailer',
      '',
    )}/email-templates/booking-confirmation/images`;

    return await this.mailerService
      .sendMail({
        to,
        from: this.configService.get('MAILER_USER'),
        subject: 'Booking Confirmation',
        template: 'booking-confirmation/booking-confirmation-flights-updated',
        context: {
          bookingNumber: 'test',
          airlineRef: 'P N S 8 C I',
        },
        attachments: [
          {
            filename: 'GalagoLogo_1.png',
            path: `${attachmentPath}/GalagoLogo_1.png`,
            cid: 'GalagoLogo_1',
          },
          {
            filename: 'facebook2x.png',
            path: `${attachmentPath}/facebook2x.png`,
            cid: 'facebook2x',
          },
          {
            filename: '77a39125-07ee-4b19-b715-f8c3f7cb58aa.png',
            path: `${attachmentPath}/77a39125-07ee-4b19-b715-f8c3f7cb58aa.png`,
            cid: '77a39125-07ee-4b19-b715-f8c3f7cb58aa',
          },
          {
            filename: 'instagram2x.png',
            path: `${attachmentPath}/instagram2x.png`,
            cid: 'instagram2x',
          },
          {
            filename: 'mail2x.png',
            path: `${attachmentPath}/mail2x.png`,
            cid: 'mail2x',
          },
        ],
      })
      .catch((err) => {
        console.log('err: ', err);
        return err;
      });
  }

  async flightsOneWayBookingConfirmation(
    flightsOneWayBookingConfirmationRequestDto: FlightsOneWayBookingConfirmationRequestDto,
  ) {
    this.loggerService.log('flightsOneWayBookingConfirmation...');

    const {
      to,
      bookingStatus,
      bookingNumber,
      airlineRef,
      arrivalDate,
      arrivalTime,
      cabinClass,
      carrier,
      departureDate,
      departureTime,
      destination,
      destinationAirportAndTerminal,
      flightNumber,
      fromAndToWithArrow,
      origin,
      originAirportAndTerminal,
      passengerDetails,
      totalFlightDuration,
      baseFare,
      taxes,
      totalTaxesAndFees,
      grandTotal,
    } = flightsOneWayBookingConfirmationRequestDto;

    const attachmentPath = `${__dirname.replace(
      'nest-mailer',
      '',
    )}/email-templates/flights/one-way-booking-confirmation/images`;

    return await this.mailerService
      .sendMail({
        to,
        from: this.configService.get('MAILER_USER'),
        subject: 'Booking Confirmation',
        template: 'flights/one-way-booking-confirmation/new-email',
        context: {
          bookingNumber,
          airlineRef,
          bookingStatus,
          fromAndToWithArrow,
          totalFlightDuration,
          origin,
          originAirportAndTerminal,
          departureTime,
          departureDate,
          destination,
          destinationAirportAndTerminal,
          arrivalTime,
          arrivalDate,
          carrier,
          flightNumber,
          cabinClass,
          passengerDetails,
          baseFare,
          taxes,
          totalTaxesAndFees,
          grandTotal,
        },
        attachments: [
          {
            filename: 'facebook2x.png',
            path: `${attachmentPath}/facebook2x.png`,
            cid: 'facebook2x',
          },
          {
            filename: 'GalaGo_Horizontal_1.png',
            path: `${attachmentPath}/GalaGo_Horizontal_1.png`,
            cid: 'GalaGo_Horizontal_1',
          },
          {
            filename: 'GalaGO_Logo.png',
            path: `${attachmentPath}/GalaGO_Logo.png`,
            cid: 'GalaGO_Logo',
          },
          {
            filename: 'instagram2x.png',
            path: `${attachmentPath}/instagram2x.png`,
            cid: 'instagram2x',
          },
          {
            filename: 'linkedin2x.png',
            path: `${attachmentPath}/linkedin2x.png`,
            cid: 'linkedin2x',
          },
        ],
      })
      .catch((err) => {
        console.log('err: ', err);
        return err;
      });
  }

  async flightsRoundtripBookingConfirmation(
    flightsRoundtripBookingConfirmationRequestDto: FlightsRoundtripBookingConfirmationRequestDto,
  ) {
    this.loggerService.log('flightsRoundtripBookingConfirmation...');

    const {
      to,
      departureDetails,
      returnDetails,
      passengerDetails,
      baseFare,
      taxes,
      totalTaxesAndFees,
      grandTotal,
      bookingNumber,
      bookingStatus,
      airlineRef,
    } = flightsRoundtripBookingConfirmationRequestDto;

    const attachmentPath = `${__dirname.replace(
      'nest-mailer',
      '',
    )}/email-templates/flights/roundtrip-booking-confirmation/images`;

    return await this.mailerService
      .sendMail({
        to,
        from: this.configService.get('MAILER_USER'),
        subject: 'Booking Confirmation',
        template:
          'flights/roundtrip-booking-confirmation/flight-booking-confirmation-roundtrip',
        context: {
          bookingNumber,
          airlineRef,
          departureDetails,
          returnDetails,
          passengerDetails,
          baseFare,
          taxes,
          totalTaxesAndFees,
          grandTotal,
          bookingStatus,
        },
        attachments: [
          {
            filename: 'facebook2x.png',
            path: `${attachmentPath}/facebook2x.png`,
            cid: 'facebook2x',
          },
          {
            filename: 'GalaGo_Horizontal_1.png',
            path: `${attachmentPath}/GalaGo_Horizontal_1.png`,
            cid: 'GalaGo_Horizontal_1',
          },
          {
            filename: 'GalaGO_Logo.png',
            path: `${attachmentPath}/GalaGO_Logo.png`,
            cid: 'GalaGO_Logo',
          },
          {
            filename: 'instagram2x.png',
            path: `${attachmentPath}/instagram2x.png`,
            cid: 'instagram2x',
          },
          {
            filename: 'linkedin2x.png',
            path: `${attachmentPath}/linkedin2x.png`,
            cid: 'linkedin2x',
          },
        ],
      })
      .catch((err) => {
        console.log('err: ', err);
        return err;
      });
  }
}
