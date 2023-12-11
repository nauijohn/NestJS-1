import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { RequestWithUser } from '../common/interfaces/request-with-user.interface';
import { ErrorHandlerService } from '../utils/error-handler.service';
import { MyLoggerService } from '../utils/my-logger.service';
import { AuthService } from './auth.service';
import {
  Public,
  PublicAccessToken,
  PublicAuthenticated,
  PublicRefreshToken,
} from './decorators/is-public.decorator';
import { FacebookAccessTokenRequestDto } from './dtos/request/facebook-access-token-request.dto';
import { FacebookValidationMobileRequestDto } from './dtos/request/facebook-validation-mobile-request.dto';
import { SignInRequestDto } from './dtos/request/sign-in-request.dto';
import { SignUpRequestDto } from './dtos/request/sign-up-request.dto';
import { VerifyEmailRequestDto } from './dtos/request/verify-email-request.dto';
import { RefreshTokenResponseDto } from './dtos/response/refresh-token-response.dto';
import { SignInResponseDto } from './dtos/response/sign-in-response.dto';
import { SignUpResponseDto } from './dtos/response/sign-up-response.dto';
import { SignAs } from './enums/sign-as.enum';
import { AccessTokenGuard } from './guards/access-token.guard';
import { FacebookGuard } from './guards/facebook.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { UserRequest } from './interfaces/user-request.interface';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {}

  @Post('sign-up')
  @PublicAccessToken()
  @PublicAuthenticated()
  @ApiOperation({ summary: 'create new account' })
  @ApiCreatedResponse({
    status: 201,
    description: 'successfully created an account',
    type: SignUpResponseDto,
  })
  @ApiConflictResponse({
    description: 'email already exists',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          title: 'statusCode',
          description: 'status code',
          type: 'number',
          example: 409,
        },
        message: {
          title: 'message',
          description: 'message',
          type: 'string',
          example: 'Email already exists',
        },
        error: {
          title: 'error',
          description: 'error',
          type: 'string',
          example: 'Conflict',
        },
      },
    },
  })
  async signUp(
    @Req() req: RequestWithUser,
    @Body() signUpRequestDto: SignUpRequestDto,
  ): Promise<SignUpResponseDto> {
    this.loggerService.log('signUp...');

    const result = await this.authService.signUp(signUpRequestDto);
    const user = result.user;
    this.loggerService.debug('user: ', user);

    const login = (): Promise<void> => {
      return new Promise((resolve, reject) => {
        req.login(user, (err: unknown) => {
          if (err) reject(err);
          resolve();
        });
      });
    };

    await login();
    this.loggerService.debug('user: ', req.user);

    return result.tokens;
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @PublicAccessToken()
  @PublicAuthenticated()
  @UseGuards(LocalAuthGuard)
  @ApiOkResponse({
    status: 200,
    description: 'sign-in successful',
    type: SignInResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          title: 'statusCode',
          description: 'status code',
          type: 'number',
          example: 401,
        },
        message: {
          title: 'message',
          description: 'message',
          type: 'string',
          example: 'Invalid email or password',
        },
        error: {
          title: 'error',
          description: 'error',
          type: 'string',
          example: 'Unauthorized',
        },
      },
    },
  })
  async signIn(
    @Req() req: RequestWithUser,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() signInRequestDto: SignInRequestDto, // * needed for validation
  ): Promise<SignInResponseDto> {
    this.loggerService.log('signing in...');
    const { id, email, roles, signAs } = req.user;
    this.loggerService.debug('user: ', req.user);

    return await this.authService.signIn({ id, roles, signAs });
  }

  @Post('sign-out')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  // @PublicAuthenticated()
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({
    description: 'Success',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          title: 'statusCode',
          description: 'status code',
          type: 'number',
          example: 200,
        },
        message: {
          title: 'message',
          description: 'message',
          type: 'string',
          example: 'Successfully signed out.',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          title: 'statusCode',
          description: 'status code',
          type: 'number',
          example: 401,
        },
        message: {
          title: 'message',
          description: 'message',
          type: 'string',
          example: 'Unauthorized',
        },
      },
    },
  })
  async signOut(@Req() req: RequestWithUser) {
    this.loggerService.log('signing out...');

    const { user } = req;
    if (!user)
      this.errorHandlerService.unauthorizedException('User not signed-in');

    const result = await this.authService.signOut(user.id);

    const logOut = (): Promise<void> =>
      new Promise((resolve, reject) => {
        req.logOut((err: unknown) => {
          if (err) reject(err);
          resolve();
        });
      });
    const logout = (): Promise<void> =>
      new Promise((resolve, reject) => {
        req.logout((err: unknown) => {
          if (err) reject(err);
          resolve();
        });
      });
    await Promise.all([logout(), logOut()]);

    this.loggerService.debug(`isAuthenticated: ${req.isAuthenticated()}`);
    return result;
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @PublicAccessToken()
  @PublicAuthenticated()
  @UseGuards(RefreshTokenGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({
    status: 200,
    description: 'Ok response',
    type: RefreshTokenResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          title: 'statusCode',
          description: 'status code',
          type: 'number',
          example: 401,
        },
        message: {
          title: 'message',
          description: 'message',
          type: 'string',
          example: 'Unauthorized',
        },
      },
    },
  })
  async refreshToken(
    @Req() req: RequestWithUser,
  ): Promise<RefreshTokenResponseDto> {
    this.loggerService.log('refreshing token...');

    const { user } = req;
    const result = await this.authService.refreshTokens(
      user.id,
      user.refreshToken,
    );

    delete user.refreshToken;
    const login = (): Promise<void> => {
      return new Promise((resolve, reject) => {
        req.login(user, (err: unknown) => {
          if (err) reject(err);
          resolve();
        });
      });
    };

    await login();
    this.loggerService.debug('user: ', req.user);

    return result;
  }

  @Post('verify-email')
  @PublicAccessToken()
  @PublicAuthenticated()
  async isEmailExists(@Body() verifyEmailRequestDto: VerifyEmailRequestDto) {
    const data = await this.authService.isEmailExists(
      verifyEmailRequestDto.email,
    );
    return { statusCode: HttpStatus.OK, data };
  }

  @Get('/facebook')
  @PublicAccessToken()
  @PublicRefreshToken()
  @PublicAuthenticated()
  @UseGuards(FacebookGuard)
  @ApiOperation({ summary: 'facebook signUp/signIn endpoint' })
  async facebookLogin() {
    this.loggerService.log('facebookLogin...');
    return HttpStatus.OK;
  }

  @Get('/facebook/redirect')
  @PublicAccessToken()
  @PublicRefreshToken()
  @PublicAuthenticated()
  @UseGuards(FacebookGuard)
  @ApiOperation({ summary: 'facebook redirect endpoint' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'facebook redirect endpoint',
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          title: 'accessToken',
          description: 'accessToken',
          type: 'string',
          example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YzhjYzQxYzFkMmM0ODFlZjZjYWQ0ZCIsInJvbGVzIjpbInVzZXIiXSwiaWF0IjoxNjkwODgxOTM0LCJleHAiOjE2OTA4ODM3MzR9._XFC_Skxyp8QgMzK4jdsf5ToxQ-5My8FlS72JtVFWJc',
        },
        refreshToken: {
          title: 'refreshToken',
          description: 'refreshToken',
          type: 'string',
          example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YzhjYzQxYzFkMmM0ODFlZjZjYWQ0ZCIsInJvbGVzIjpbInVzZXIiXSwiaWF0IjoxNjkwODgxOTM0LCJleHAiOjE2OTE0ODY3MzR9.Xc0lr0yYM8PX3GoIaEIF2qPsZ4e3n0Dlg86BnLa8XIc',
        },
      },
    },
  })
  async facebookLoginRedirect(@Req() req: RequestWithUser): Promise<any> {
    this.loggerService.log('facebookLoginRedirect...');
    return await this.authService.facebookToken(req.user);
  }

  @Post('facebook-access-token')
  @Public()
  @ApiOperation({ summary: 'facebook access token' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'facebook access token',
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          title: 'accessToken',
          description: 'accessToken',
          type: 'string',
          example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YzhjYzQxYzFkMmM0ODFlZjZjYWQ0ZCIsInJvbGVzIjpbInVzZXIiXSwiaWF0IjoxNjkwODgxOTM0LCJleHAiOjE2OTA4ODM3MzR9._XFC_Skxyp8QgMzK4jdsf5ToxQ-5My8FlS72JtVFWJc',
        },
        refreshToken: {
          title: 'refreshToken',
          description: 'refreshToken',
          type: 'string',
          example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YzhjYzQxYzFkMmM0ODFlZjZjYWQ0ZCIsInJvbGVzIjpbInVzZXIiXSwiaWF0IjoxNjkwODgxOTM0LCJleHAiOjE2OTE0ODY3MzR9.Xc0lr0yYM8PX3GoIaEIF2qPsZ4e3n0Dlg86BnLa8XIc',
        },
      },
    },
  })
  async getFacebookAccessToken(
    @Body() facebookAccessTokenRequestDto: FacebookAccessTokenRequestDto,
  ) {
    this.loggerService.log('getFacebookAccessToken...');

    return await this.authService.getFacebookAccessToken(
      facebookAccessTokenRequestDto.code,
    );
  }

  @Post('facebook-validation-mobile')
  @HttpCode(HttpStatus.OK)
  @Public()
  async facebookValidationMobile(
    @Body()
    facebookValidationMobileRequestDto: FacebookValidationMobileRequestDto,
  ) {
    this.loggerService.log('facebookValidationMobile...');

    const facebookUser = await this.authService.facebookValidationMobile(
      facebookValidationMobileRequestDto,
    );
    const user: UserRequest = {
      email: facebookUser.email,
      id: facebookUser.id,
      roles: facebookUser.roles,
      signAs: SignAs.FacebookUser,
    };
    return await this.authService.facebookToken(user);
  }
}
