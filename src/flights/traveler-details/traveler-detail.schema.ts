import { HydratedDocument, Types } from 'mongoose';

import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { FacebookUser } from '../../users/facebook-users/facebook-user.schema';
import { LocalUser } from '../../users/local-users/local-user.schema';

export type TravelerDetailDocument = HydratedDocument<TravelerDetail>;

@Schema({ timestamps: true })
export class TravelerDetail {
  @AutoMap()
  _id: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    enum: ['LocalUser', 'FacebookUser'],
  })
  @AutoMap()
  signAs: string;

  @Prop({
    type: Types.ObjectId,
    required: true,
    refPath: 'signAs',
  })
  @AutoMap()
  user: LocalUser | FacebookUser;

  @Prop({
    type: String,
    required: true,
    minlength: 1,
    maxlength: 255,
    unique: false,
  })
  @AutoMap()
  firstName: string;

  @Prop({
    type: String,
    required: false,
    minlength: 1,
    maxlength: 255,
    unique: false,
  })
  @AutoMap()
  middleName: string;

  @Prop({
    type: String,
    required: true,
    minlength: 1,
    maxlength: 255,
    unique: false,
  })
  @AutoMap()
  lastName: string;

  // @Prop({})
  // @AutoMap()
  // gender: string;

  @Prop({
    type: String,
    isRequired: false,
  })
  @AutoMap()
  title: string;

  @Prop({
    type: String,
    required: true,
    minlength: 1,
    maxlength: 255,
    unique: false,
  })
  @AutoMap()
  nationality: string;

  @Prop({
    type: String,
    required: true,
  })
  @AutoMap()
  birthDate: string;

  @Prop({
    type: String,
    required: false,
    minlength: 1,
    maxlength: 255,
    unique: false,
  })
  @AutoMap()
  passportNumber?: string;

  @Prop({
    type: String,
    required: false,
    minlength: 1,
    maxlength: 255,
    unique: false,
  })
  @AutoMap()
  expirationDate?: string;

  @Prop({
    type: String,
    required: false,
    minlength: 1,
    maxlength: 255,
    unique: false,
  })
  @AutoMap()
  email?: string;

  @Prop({
    type: String,
    required: false,
    minlength: 1,
    maxlength: 255,
    unique: false,
  })
  @AutoMap()
  mobileNumber?: string;

  @Prop({
    type: String,
    required: false,
    minlength: 1,
    maxlength: 255,
    unique: false,
  })
  @AutoMap()
  countryIssued?: string;

  @AutoMap()
  createdAt?: Date;

  @AutoMap()
  updatedAt?: Date;
}

export const TravelerDetailSchema =
  SchemaFactory.createForClass(TravelerDetail);
