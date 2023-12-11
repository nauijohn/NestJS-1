import { IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class FacebookAccessTokenRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    title: 'code',
    description: 'facebook redirect code',
    required: true,
    example:
      'AQDM7hNo4BcsMy6K24x6D7PEAKibEwhG-c1yj-_NGLSzEEYNPIJ-_8c9Z7aJ8uR_zH5ph7XP5t2oGtsIDL4Qujleo2CDtnXAEojm-IMFDUqSBxJ5u-IIUjScxM6eQC6S74ZvnmQsfsiaksQRZXKPllVdmsFWlIYMToWtM-Ww-NeuaOrrLcR7-4u5oBc8XLbJ0vWSMw_R3w1sSA8lSxQN9Qpp9nslf6OIY6UcjqhoOKCc3axJzqco8eD7mqyF3KYMOsoKFG-l9n0vkRLU48e4ahDvnOqm5jRbHyERu0pvd4zoEyVCtjfux-89cHE2MoB-rGAz3OS22A-tYd1xuGyAQWemIVbQf8nEnBJW33NLixsmgaJa25dxHmE-yRpbl_NArtg#_=_',
  })
  code: string;
}
