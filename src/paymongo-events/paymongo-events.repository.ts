import { Model } from 'mongoose';

import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { MyLoggerService } from '../utils/my-logger.service';
import { PaymongoEventDto } from './dtos/paymongo-event.dto';
import { CreatePaymongoEventRequestDto } from './dtos/request/create-paymongo-event-request.dto';
import { PaymongoEvent } from './paymongo-event.schema';

@Injectable()
export class PaymongoEventsRepository {
  constructor(
    @InjectMapper()
    private readonly classMapper: Mapper,
    @InjectModel(PaymongoEvent.name)
    private readonly paymongoEventModel: Model<PaymongoEvent>,
    private readonly loggerService: MyLoggerService,
  ) {}

  async create(createPaymongoEventRequestDto: CreatePaymongoEventRequestDto) {
    this.loggerService.log('create...');

    const document = await this.paymongoEventModel.create({
      eventId: createPaymongoEventRequestDto.data.id,
      type: createPaymongoEventRequestDto.data.attributes.type,
      data: createPaymongoEventRequestDto.data.attributes.data,
    });
    return document
      ? this.classMapper.map(document, PaymongoEvent, PaymongoEventDto)
      : null;
  }
}
