import { HydratedDocument, Types } from 'mongoose';

import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type PaymongoEventDocument = HydratedDocument<PaymongoEvent>;

@Schema({ timestamps: true })
export class PaymongoEvent {
  @AutoMap()
  _id: Types.ObjectId;

  @Prop({ type: String, required: true })
  @AutoMap()
  eventId: string;

  @Prop({ type: String, required: true })
  @AutoMap()
  type: string;

  @Prop({ type: Object, required: true })
  @AutoMap()
  data: Object;

  @AutoMap()
  createdAt?: Date;

  @AutoMap()
  updatedAt?: Date;
}

export const PaymongoEventSchema = SchemaFactory.createForClass(PaymongoEvent);
