import { IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class SignInResponseDto {
  @IsString()
  @ApiProperty({
    type: 'string',
    title: 'accessToken',
    name: 'accessToken',
    description: 'user access token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YjAyYmFmMDA3ZjNkZWE5NzlmM2ViYiIsImVtYWlsIjoidGVzdEVtYWlsNEB0ZXN0LmNvbSIsImZyb21Mb2NhbFN0cmF0ZWd5IjoidGVzdCIsImZyb21Mb2NhbEF1dGhHdWFyZCI6InRlc3QiLCJpYXQiOjE2ODkzMjQyODksImV4cCI6MTY4OTkyOTA4OX0.ScDWf_N5eJjcPifIkqhnNU49rfjeAHQt7W1OhlJ6XdA',
  })
  accessToken: string;

  @IsString()
  @ApiProperty({
    type: 'string',
    title: 'refreshToken',
    name: 'refreshToken',
    description: 'user refresh token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YjAyYmFmMDA3ZjNkZWE5NzlmM2ViYiIsImVtYWlsIjoidGVzdEVtYWlsNEB0ZXN0LmNvbSIsImZyb21Mb2NhbFN0cmF0ZWd5IjoidGVzdCIsImZyb21Mb2NhbEF1dGhHdWFyZCI6InRlc3QiLCJpYXQiOjE2ODkzMjQyODksImV4cCI6MTY4OTkyOTA4OX0.ScDWf_N5eJjcPifIkqhnNU49rfjeAHQt7W1OhlJ6XdA',
  })
  refreshToken: string;
}
