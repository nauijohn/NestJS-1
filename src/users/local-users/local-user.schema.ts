import { Date, HydratedDocument, now, Types } from 'mongoose';

import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { UserRole } from '../../user-roles/user-role.schema';

export type LocalUserDocument = HydratedDocument<LocalUser>;

@Schema({ timestamps: true })
export class LocalUser {
  @AutoMap()
  _id: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  })
  @AutoMap()
  email: string;

  @Prop({
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    match: /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
  })
  @AutoMap()
  password: string;

  @Prop({
    type: Date,
    default: now(),
  })
  @AutoMap()
  passwordUpdatedAt: Date;

  @Prop({
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  })
  @AutoMap()
  firstName: string;

  @Prop({
    type: String,
    required: false,
    maxlength: 255,
  })
  @AutoMap()
  middleName?: string;

  @Prop({
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  })
  @AutoMap()
  lastName: string;

  @Prop({ type: String })
  @AutoMap()
  mobileNumber?: string;

  @Prop({
    type: String,
    required: true,
  })
  @AutoMap()
  birthDate: string;

  @Prop({ type: [Types.ObjectId], ref: UserRole.name })
  @AutoMap()
  roles: UserRole[];

  @AutoMap()
  createdAt?: Date;

  @AutoMap()
  updatedAt?: Date;
}

export const LocalUserSchema = SchemaFactory.createForClass(LocalUser);
