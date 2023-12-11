import { ApiProperty } from '@nestjs/swagger';

export class MystiflyBookData {
  @ApiProperty({
    name: 'ClientUTCOffset',
    title: 'ClientUTCOffset',
    description: 'ClientUTCOffset of Mystifly Book Results',
    type: 'number',
    example: 0,
  })
  ClientUTCOffset: number;

  @ApiProperty({
    name: 'ConversationId',
    title: 'ConversationId',
    description: 'ConversationId of Mystifly Book Results',
    type: 'string',
    example: '3c07d5c1-387b-42d8-8d91-349fbea1938b',
  })
  ConversationId: string;

  @ApiProperty({
    name: 'Errors',
    title: 'Errors',
    description: 'Errors of Mystifly Book Results',
    type: Array<unknown>,
    example: [],
  })
  Errors: Array<unknown>;

  @ApiProperty({
    name: 'Status',
    title: 'Status',
    description: 'Status of Mystifly Book Results',
    type: 'string',
    example: 'CONFIRMED',
  })
  Status: string;

  @ApiProperty({
    name: 'Success',
    title: 'Success',
    description: 'Success of Mystifly Book Results',
    type: 'boolean',
    example: true,
  })
  Success: boolean;

  @ApiProperty({
    name: 'Target',
    title: 'Target',
    description: 'Target of Mystifly Book Results',
    type: 'string',
    example: 'Test',
  })
  Target: string;

  @ApiProperty({
    name: 'TktTimeLimit',
    title: 'TktTimeLimit',
    description: 'TktTimeLimit of Mystifly Book Results',
    type: 'string',
    example: '2023-10-20T07:38:01',
  })
  TktTimeLimit: string;

  @ApiProperty({
    name: 'TraceId',
    title: 'TraceId',
    description: 'TraceId of Mystifly Book Results',
    type: 'string',
    example: '23101812-aad2f240-9fa2-4d6a-a3ca-f30369e06642',
  })
  TraceId: string;

  @ApiProperty({
    name: 'UniqueID',
    title: 'UniqueID',
    description: 'UniqueID of Mystifly Book Results',
    type: 'string',
    example: 'MF24713323',
  })
  UniqueID: string;
}

export class MystiflyBookResponseDto {
  Data: MystiflyBookData;
  Success: boolean;
  Message?: string;
}
