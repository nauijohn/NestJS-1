import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { FacebookUser } from '../../../../users/facebook-users/facebook-user.schema';
import { LocalUser } from '../../../../users/local-users/local-user.schema';

class TravelerDetailsResponse {
  @ApiProperty({
    type: 'string',
    title: 'signAs',
    name: 'signAs',
    description: 'sign as facebookuser or localuser',
    example: 'LocalUser',
  })
  signAs: string;

  @ApiProperty({
    type: 'string',
    title: 'firstName',
    name: 'firstName',
    description: 'first name of traveler detail user',
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    type: 'string',
    title: 'middleName',
    name: 'middleName',
    description: 'middle name of traveler detail user',
    example: 'Marquez',
  })
  middleName: string;

  @ApiProperty({
    type: 'string',
    title: 'lastName',
    name: 'lastName',
    description: 'last name of traveler detail user',
    example: 'Doe',
  })
  lastName: string;

  @ApiProperty({
    type: 'string',
    title: 'nationality',
    name: 'nationality',
    description: 'nationality of travel detail user',
    example: 'Filipino',
  })
  nationality: string;

  @ApiProperty({
    type: 'string',
    title: 'birthDate',
    name: 'birthDate',
    description: 'birth date of travel detail user',
    example: '1993-06-09',
  })
  birthDate: string;

  // @ApiProperty({
  //   type: 'string',
  //   title: 'gender',
  //   name: 'gender',
  //   description: 'gender of travel detail user',
  //   example: 'male',
  // })
  // gender: string;

  @ApiProperty({
    type: 'string',
    title: 'title',
    name: 'title',
    description: 'title of travel detail user',
    example: 'male',
  })
  title: string;

  @ApiProperty({
    type: 'string',
    title: 'passportNumber',
    name: 'passportNumber',
    description: 'passport number of travel detail user',
    example: 'TBD',
  })
  passportNumber?: string;

  @ApiProperty({
    type: 'string',
    title: 'expirationDate',
    name: 'expirationDate',
    description: 'expiration date of passport number of travel detail user',
    example: 'TBD',
  })
  expirationDate?: string;

  @ApiProperty({
    type: 'string',
    title: 'mobileNumber',
    name: 'mobileNumber',
    description: 'mobile number of travel detail user',
    example: '+639999908116',
  })
  mobileNumber?: string;

  @ApiProperty({
    type: 'string',
    title: 'createdAt',
    name: 'createdAt',
    description: 'createdAt',
    example: '2023-08-15T05:57:33.991Z',
  })
  createdAt: Date;

  @ApiProperty({
    type: 'string',
    title: 'updatedAt',
    name: 'updatedAt',
    description: 'updatedAt',
    example: '2023-08-15T05:57:33.991Z',
  })
  updatedAt: Date;

  @ApiProperty({
    type: 'string',
    title: 'id',
    name: 'id',
    description: 'id in database',
    example: '64db13cd81ade45571fa1854',
  })
  id?: string;

  @ApiProperty({
    type: 'string',
    title: 'user',
    name: 'user',
    description: 'user details of travel detail user',
    example: '64d5f1b07f89184b3ee36175',
  })
  user: LocalUser | FacebookUser;
}

export class GetTravelerDetailsResponseDto {
  @ApiProperty({
    type: 'number',
    title: 'message',
    name: 'message',
    description: 'message',
    example: 200,
  })
  statusCode: HttpStatus;

  @ApiProperty({
    title: 'data',
    type: [TravelerDetailsResponse],
  })
  data: TravelerDetailsResponse[];
}
