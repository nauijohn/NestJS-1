import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Public } from '../auth/decorators/is-public.decorator';
import { MyLoggerService } from '../utils/my-logger.service';
import { CreatePaymongoEventRequestDto } from './dtos/request/create-paymongo-event-request.dto';
import { PaymongoEventsService } from './paymongo-events.service';

@Controller('paymongo-events')
@ApiTags('Paymongo Events')
export class PaymongoEventsController {
  constructor(
    private readonly paymongoEventsService: PaymongoEventsService,
    private readonly loggerService: MyLoggerService,
  ) {}

  @Post()
  @Public()
  async create(
    @Body() createPaymongoEventRequestDto: CreatePaymongoEventRequestDto,
  ) {
    this.loggerService.log('create...');

    this.loggerService.debug(
      'createPaymongoEventRequestDto: ',
      createPaymongoEventRequestDto,
    );

    // const paymongoEvent = await this.paymongoEventsService.create(
    //   createPaymongoEventRequestDto,
    // );
    // const isUpdated = await this.paymongoEventsService.verifyPayment(
    //   createPaymongoEventRequestDto,
    // );

    const [paymongoEvent, isStatusUpdated] = await Promise.all([
      this.paymongoEventsService.create(createPaymongoEventRequestDto),
      this.paymongoEventsService.verifyPayment(createPaymongoEventRequestDto),
    ]);
    return {
      statusCode: HttpStatus.OK,
      data: {
        paymongoEvent,
        isStatusUpdated,
      },
    };
  }
}
