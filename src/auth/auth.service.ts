import * as bcrypt from 'bcrypt';
import { Profile } from 'passport-facebook';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import {
  JWT_ACCESS_TOKEN_EXPIRES_IN,
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_EXPIRES_IN,
  JWT_REFRESH_TOKEN_SECRET,
} from '../config/config.constant';
import { FacebookService } from '../providers/facebook/facebook.service';
import { RefreshTokensService } from '../refresh-tokens/refresh-tokens.service';
import { UserRolesService } from '../user-roles/user-roles.service';
import { FacebookUsersService } from '../users/facebook-users/facebook-users.service';
import { LocalUsersService } from '../users/local-users/local-users.service';
import { ErrorHandlerService } from '../utils/error-handler.service';
import { MyLoggerService } from '../utils/my-logger.service';
import { FacebookValidationMobileRequestDto } from './dtos/request/facebook-validation-mobile-request.dto';
import { SignUpRequestDto } from './dtos/request/sign-up-request.dto';
import { SignInResponseDto } from './dtos/response/sign-in-response.dto';
import { Role } from './enums/role.enum';
import { SignAs } from './enums/sign-as.enum';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { Tokens } from './interfaces/tokens.interface';
import { UserRequest } from './interfaces/user-request.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly localUsersService: LocalUsersService,
    private readonly facebookUsersService: FacebookUsersService,
    private readonly userRolesService: UserRolesService,
    private readonly refreshTokensService: RefreshTokensService,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly facebookService: FacebookService,
  ) {}

  async signUp(signUpRequestDto: SignUpRequestDto) {
    this.loggerService.log('signUp...');

    const isEmailExists = await this.localUsersService.isEmailExists(
      signUpRequestDto.email,
    );
    if (isEmailExists)
      this.errorHandlerService.conflictException('Email already exists');

    const hashedPassword = await this.hashString(signUpRequestDto.password);
    const user = await this.localUsersService.create({
      email: signUpRequestDto.email,
      password: hashedPassword,
      firstName: signUpRequestDto.firstName,
      middleName: signUpRequestDto.middleName,
      lastName: signUpRequestDto.lastName,
      mobileNumber: signUpRequestDto.mobileNumber,
      birthDate: signUpRequestDto.birthDate,
    });
    const userRole = await this.userRolesService.create({
      userId: user.id,
      role: Role.User,
      signAs: SignAs.LocalUser,
    });
    const jwtPayload: JwtPayload = {
      id: user.id,
      roles: [userRole.role],
      signAs: SignAs.LocalUser,
    };

    const tokens = await this.createTokensInDB(jwtPayload, SignAs.LocalUser);

    return {
      tokens,
      user: { id: user.id, role: userRole.role, email: user.email },
    };
  }

  async signIn(jwtPayload: JwtPayload): Promise<SignInResponseDto> {
    this.loggerService.log('signIn...');
    this.loggerService.debug('payload: ', jwtPayload);
    const tokens = await this.updateTokensInDB(jwtPayload);
    return tokens;
  }

  async signOut(userId: string) {
    this.loggerService.log('signOut...');
    await this.refreshTokensService.update({
      userId,
      refreshToken: null,
    });
    return { statusCode: 200, message: 'Successfully signed out.' };
  }

  async facebookToken(user: UserRequest) {
    this.loggerService.log('facebookToken...');

    const jwtPayload: JwtPayload = {
      id: user.id,
      roles: [...user.roles],
      signAs: SignAs.FacebookUser,
    };
    const refreshToken = await this.refreshTokensService.findByUserId(user.id);
    if (refreshToken) return await this.updateTokensInDB(jwtPayload);
    return await this.createTokensInDB(jwtPayload, SignAs.FacebookUser);
  }

  async validateUserForLocalStrategy(email: string, password: string) {
    this.loggerService.log('validateUserForLocalStrategy...');
    const user = await this.localUsersService.findWithPasswordByEmail(email);
    if (!user)
      this.errorHandlerService.unauthorizedException(
        'Invalid email or password',
      );
    if (user.roles.length === 0)
      this.errorHandlerService.unauthorizedException('No role for user');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      this.errorHandlerService.unauthorizedException(
        'Invalid email or password',
      );

    this.loggerService.log('user validated!');
    return user;
  }

  async validateUserForFacebookStrategy(profile: Profile) {
    this.loggerService.log('validateUserForFacebookStrategy...');

    const user = await this.facebookUsersService.findByFacebookId(profile.id);
    if (user) return user;

    const newUser = await this.facebookUsersService.create({
      facebookId: profile.id,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      middleName: profile.name.middleName,
      email: profile.emails ? profile.emails[0].value : null,
      profilePic: profile.photos[0].value,
    });
    const userRole = await this.userRolesService.create({
      userId: newUser.id,
      role: Role.User,
      signAs: SignAs.FacebookUser,
    });
    newUser.roles.push(userRole.role);
    return newUser;
  }

  async refreshTokens(
    userId: string,
    refreshTokenInput: string,
  ): Promise<Tokens> {
    this.loggerService.log('refreshTokens...');

    const userRefreshToken = await this.refreshTokensService.findByUserId(
      userId,
    );
    if (!userRefreshToken || !userRefreshToken.refreshToken)
      this.errorHandlerService.forbiddenException('Access Denied');

    const isRefreshTokenValid = await bcrypt.compare(
      refreshTokenInput,
      userRefreshToken.refreshToken,
    );
    if (!isRefreshTokenValid)
      this.errorHandlerService.unauthorizedException('Invalid token');

    const isRefreshTokenVerified =
      await this.jwtService.verifyAsync<JwtPayload>(refreshTokenInput, {
        secret: this.configService.get(JWT_REFRESH_TOKEN_SECRET),
      });
    if (!isRefreshTokenVerified)
      this.errorHandlerService.forbiddenException('Access Denied');

    const { id, roles, signAs } = isRefreshTokenVerified;
    const jwtPayload: JwtPayload = { id, roles, signAs };
    return await this.updateTokensInDB(jwtPayload);
  }

  async isEmailExists(email: string) {
    const localUserEmail = await this.localUsersService.isEmailExists(email);

    if (localUserEmail)
      return {
        isEmailExists: true,
        signAs: SignAs.LocalUser,
        profilePic: 'Not Implemented Yet',
      };
    const facebookUserEmail = await this.facebookUsersService.isEmailExists(
      email,
    );

    if (facebookUserEmail) {
      const { profilePic } = await this.facebookUsersService.findByEmail(email);
      return {
        isEmailExists: true,
        signAs: SignAs.FacebookUser,
        profilePic,
      };
    }
    return { isEmailExists: false, signAs: SignAs.None, profilePic: null };
  }

  async getUser(email: string) {
    return await this.localUsersService.findByEmail(email);
  }

  async getFacebookAccessToken(code: string) {
    this.loggerService.log('getFacebookAccessToken...');

    const { access_token } = await this.facebookService.getAccessToken(code);
    const { data } = await this.facebookService.decodeAccessToken(access_token);
    const { user_id: facebookId } = data;
    const facebookUser = await this.facebookUsersService.findByFacebookId(
      facebookId,
    );
    const user = {
      id: facebookUser.id,
      email: facebookUser.email,
      roles: facebookUser.roles,
      signAs: SignAs.FacebookUser,
    };

    return await this.facebookToken(user);
  }

  async facebookValidationMobile(
    facebookValidationMobileRequestDto: FacebookValidationMobileRequestDto,
  ) {
    this.loggerService.log('facebookValidationMobile...');

    console.log(
      'facebookValidationMobileRequestDto: ',
      facebookValidationMobileRequestDto,
    );

    const user = await this.facebookUsersService.findByFacebookId(
      facebookValidationMobileRequestDto.id,
    );
    if (user) return user;

    const newUser = await this.facebookUsersService.create({
      facebookId: facebookValidationMobileRequestDto.id ?? null,
      firstName: facebookValidationMobileRequestDto.first_name ?? null,
      lastName: facebookValidationMobileRequestDto.last_name ?? null,
      middleName: facebookValidationMobileRequestDto.middle_name ?? null,
      email: facebookValidationMobileRequestDto.email ?? null,
      profilePic: facebookValidationMobileRequestDto.picture.data.url,
    });
    const userRole = await this.userRolesService.create({
      userId: newUser.id,
      role: Role.User,
      signAs: SignAs.FacebookUser,
    });
    newUser.roles.push(userRole.role);
    return newUser;
  }

  private async hashString(word: string) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedWord = await bcrypt.hash(word, salt);
    return hashedWord;
  }

  private async createTokensInDB(jwtPayload: JwtPayload, signAs: SignAs) {
    const tokens = await this.getTokens(jwtPayload);
    const hashedRefreshToken = await this.hashString(tokens.refreshToken);
    const refreshToken = await this.refreshTokensService.create({
      userId: jwtPayload.id,
      refreshToken: hashedRefreshToken,
      signAs,
    });
    if (!refreshToken)
      this.errorHandlerService.internalServerErrorException(
        'Refresh token service error...',
      );
    return tokens;
  }

  private async updateTokensInDB(jwtPayload: JwtPayload) {
    console.log('jwtPayload: ', jwtPayload);
    const tokens = await this.getTokens(jwtPayload);
    const hashedRefreshToken = await this.hashString(tokens.refreshToken);
    const refreshToken = await this.refreshTokensService.update({
      userId: jwtPayload.id,
      refreshToken: hashedRefreshToken,
    });
    if (!refreshToken)
      this.errorHandlerService.internalServerErrorException(
        'RefreshToken update error',
      );
    return tokens;
  }

  private async getTokens(jwtPayload: JwtPayload): Promise<Tokens> {
    this.loggerService.log('getTokens...');

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get(JWT_ACCESS_TOKEN_SECRET),
        expiresIn: this.configService.get(JWT_ACCESS_TOKEN_EXPIRES_IN),
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get(JWT_REFRESH_TOKEN_SECRET),
        expiresIn: this.configService.get(JWT_REFRESH_TOKEN_EXPIRES_IN),
      }),
    ]);
    return { accessToken, refreshToken };
  }
}
