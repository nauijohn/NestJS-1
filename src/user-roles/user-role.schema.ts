import { HydratedDocument, Types } from 'mongoose';

import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { FacebookUser } from '../users/facebook-users/facebook-user.schema';
import { LocalUser } from '../users/local-users/local-user.schema';

export type UserRoleDocument = HydratedDocument<UserRole>;

@Schema({ timestamps: true })
export class UserRole {
  @AutoMap()
  _id: Types.ObjectId;

  @Prop({ type: String, enum: ['LocalUser', 'FacebookUser'] })
  @AutoMap()
  signAs: string;

  @Prop({ type: Types.ObjectId, refPath: 'signAs' })
  @AutoMap()
  user: LocalUser | FacebookUser;

  @Prop({ type: String, required: false })
  @AutoMap()
  role: string;

  @AutoMap()
  createdAt?: Date;

  @AutoMap()
  updatedAt?: Date;
}

export const UserRoleSchema = SchemaFactory.createForClass(UserRole);
