import { Request } from 'express';

import { ForbiddenError } from '@casl/ability';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

import {
  CheckAbilities,
  ReadUserAbility,
} from '../../ability/abilities.decorator';
import { AbilityFactory, Action } from '../../ability/ability.factory';
import { Public } from '../../auth/decorators/is-public.decorator';
import { MyLoggerService } from '../../utils/my-logger.service';
import { ChangePasswordLocalUserRequestDto } from './dtos/request/change-password-local-user-request.dto';
import { CreateLocalUserRequestDto } from './dtos/request/create-user-request.dto';
import { UploadFileLocalUserRequestDto } from './dtos/request/upload-file-local-user-request.dto';
import { VerifyPasswordLocalUserRequestDto } from './dtos/request/verify-password-local-user-request.dto';
import { LocalUser } from './local-user.schema';
import { LocalUsersService } from './local-users.service';

interface RequestWithUser extends Request {
  // user: {
  //   id: string;
  //   email: string;
  //   roles: string[];
  // };
  user: LocalUser;
}

@Controller()
@ApiTags('users')
@ApiBearerAuth('JWT-auth')
export class LocalUsersController {
  constructor(
    private readonly localUsersService: LocalUsersService,
    private readonly abilityFactory: AbilityFactory,
    private readonly loggerService: MyLoggerService,
  ) {}

  @Get('file')
  async fetchFileByKeyFromS3() {
    this.loggerService.log('fetchFileByKeyFromS3...');

    const data = await this.localUsersService.fetchFileByKeyFromS3();
    return { statusCode: HttpStatus.OK, data };
  }

  @Post('file-old')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 50000000 })],
      }),
    )
    file: Express.Multer.File,
  ) {
    this.loggerService.log('uploadFile...');

    return {
      statusCode: HttpStatus.CREATED,
      data: await this.localUsersService.uploadFile(file),
    };
  }

  @Post('file')
  @HttpCode(HttpStatus.OK)
  async uploadFile2(
    @Body() uploadFileLocalUserRequestDto: UploadFileLocalUserRequestDto,
  ) {
    this.loggerService.log('uploadFile...');

    const data = await this.localUsersService.uploadFile2(
      uploadFileLocalUserRequestDto,
    );
    return { statusCode: HttpStatus.CREATED, data };
  }

  @Post()
  async create(
    @Req() req: RequestWithUser,
    @Body() createLocalUserRequestDto: CreateLocalUserRequestDto,
  ) {
    const { user } = req;
    const ability = this.abilityFactory.defineAbility(user);
    // const isAllowed = ability.can(Action.Create, User);
    // this.loggerService.debug(`isAllowed: ${isAllowed}`);
    // if (!isAllowed)
    //   this.errorHandlerServicer.unauthorizedException('only admin');
    ForbiddenError.from(ability).throwUnlessCan(Action.Create, LocalUser);
    return await this.localUsersService.create(createLocalUserRequestDto);
  }

  @Post('verify-email')
  @Public()
  async verifyEmail(@Body('email') email: string) {
    this.loggerService.log('verifyEmail...');
    const data = await this.localUsersService.isEmailExists(email);
    return { statusCode: HttpStatus.OK, data };
  }

  @Put('password/change')
  async changePassword(
    @Body()
    changePasswordLocalUserRequestDto: ChangePasswordLocalUserRequestDto,
  ) {
    this.loggerService.log('changePassword...');

    const { message } = await this.localUsersService.changePassword(
      changePasswordLocalUserRequestDto,
    );
    return { statusCode: HttpStatus.OK, message };
  }

  @Post('password/verify')
  @HttpCode(HttpStatus.OK)
  async verifyPassword(
    @Body()
    verifyPasswordLocalUserRequestDto: VerifyPasswordLocalUserRequestDto,
  ) {
    this.loggerService.log('verifyPassword...');

    const isVerified = await this.localUsersService.verifyPassword(
      verifyPasswordLocalUserRequestDto,
    );
    let message = 'Password is verified';
    if (!isVerified) message = 'Password is incorrect';

    return { statusCode: HttpStatus.OK, message };
  }

  @Get(':id')
  @CheckAbilities(new ReadUserAbility())
  async fetchUserById(@Param('id') id: string) {
    return await this.localUsersService.fetchByIdWithRoles(id);
  }

  private base64ToArrayBuffer(base64) {
    var binaryString = atob(base64);
    var bytes = new Uint8Array(binaryString.length);
    for (var i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
}
