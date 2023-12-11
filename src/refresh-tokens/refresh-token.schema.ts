import { HydratedDocument, Types } from 'mongoose';

import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { FacebookUser } from '../users/facebook-users/facebook-user.schema';
import { LocalUser } from '../users/local-users/local-user.schema';

export type UserDocument = HydratedDocument<RefreshToken>;

@Schema({ timestamps: true })
export class RefreshToken {
  @AutoMap()
  _id: Types.ObjectId;

  @Prop({ type: String, enum: ['LocalUser', 'FacebookUser'] })
  @AutoMap()
  signAs: string;

  @Prop({ type: Types.ObjectId, refPath: 'signAs' })
  @AutoMap()
  userId: LocalUser | FacebookUser;

  @Prop({ type: String, required: false })
  @AutoMap()
  refreshToken: string;

  @AutoMap()
  createdAt?: Date;

  @AutoMap()
  updatedAt?: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
