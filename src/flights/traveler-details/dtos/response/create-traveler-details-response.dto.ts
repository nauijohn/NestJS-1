import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTravelerDetailsResponseDto {
  @ApiProperty({
    type: 'number',
    title: 'statusCode',
    name: 'statusCode',
    description: 'status code',
    example: 200,
  })
  statusCode: HttpStatus;

  @ApiProperty({
    type: 'string',
    title: 'message',
    name: 'message',
    description: 'message',
    example: 'Successfully created traveler detail',
  })
  message: string;
}
