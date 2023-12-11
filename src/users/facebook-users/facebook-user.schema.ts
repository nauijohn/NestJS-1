import { Date, HydratedDocument, Types } from 'mongoose';

import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { UserRole } from '../../user-roles/user-role.schema';

export type FacebookUserDocument = HydratedDocument<FacebookUser>;

@Schema({ timestamps: true })
export class FacebookUser {
  @AutoMap()
  _id: Types.ObjectId;

  @Prop({
    type: String,
    required: false,
    minlength: 5,
    maxlength: 255,
    unique: true,
  })
  @AutoMap()
  email?: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  @AutoMap()
  facebookId: string;

  @Prop({
    type: String,
    required: false,
    minlength: 2,
    maxlength: 255,
  })
  @AutoMap()
  firstName: string;

  @Prop({
    type: String,
    required: false,
    minlength: 2,
    maxlength: 255,
  })
  @AutoMap()
  middleName?: string;

  @Prop({
    type: String,
    required: false,
    minlength: 2,
    maxlength: 255,
  })
  @AutoMap()
  lastName: string;

  // @Prop({ type: String })
  // @AutoMap()
  // mobileNumber?: string;

  // @Prop({
  //   type: String,
  //   required: true,
  // })
  // @AutoMap()
  // birthDate: string;

  @Prop({
    type: String,
    required: false,
  })
  @AutoMap()
  profilePic: string;

  @Prop({ type: [Types.ObjectId], ref: UserRole.name })
  @AutoMap()
  roles: UserRole[];

  @AutoMap()
  createdAt?: Date;

  @AutoMap()
  updatedAt?: Date;
}

export const FacebookUserSchema = SchemaFactory.createForClass(FacebookUser);
