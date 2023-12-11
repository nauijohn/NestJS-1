import { Cache } from 'cache-manager';

import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MystiflyFlightUtilsService } from '../providers/mystifly/flight-utils/mystifly-flight-utils.service';
import { ErrorHandlerService } from '../utils/error-handler.service';
import { MyLoggerService } from '../utils/my-logger.service';
import { Credential } from './credential.entity';
import { CredentialsRepository } from './credentials.repository';
import { CredentialsUtil } from './credentials.util';
import { CreateCredentialRequestDto } from './dtos/request/create-credential-request.dto';
import { UpdateCredentialRequestDto } from './dtos/request/update-credential-request.dto';
import { Providers } from './providers.enum';

@Injectable()
export class CredentialsService extends CredentialsUtil {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    private readonly credentialsRepository: CredentialsRepository,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @Inject(forwardRef(() => MystiflyFlightUtilsService))
    private readonly mystiflyFlightUtilsService: MystiflyFlightUtilsService,
  ) {
    super(loggerService, configService);
  }

  async create(createCredentialRequestDto: CreateCredentialRequestDto) {
    this.loggerService.log('create...');

    const credential = this.classMapper.map(
      createCredentialRequestDto,
      CreateCredentialRequestDto,
      Credential,
    );

    if (credential.provider.toLocaleLowerCase() === Providers.Mystifly) {
      const { accountNumber, username, password } = credential;
      const mystiflyCreateSessionResponse =
        await this.mystiflyFlightUtilsService.createSession({
          accountNumber,
          username,
          password,
        });
      if (mystiflyCreateSessionResponse.Success)
        credential.bearer = mystiflyCreateSessionResponse.Data.SessionId;
    }

    await this.encryptCredential(credential);
    return await this.credentialsRepository.create(credential);
  }

  async fetchAll() {
    this.loggerService.log('fetchAll...');

    const credentials = await this.credentialsRepository.fetchAll();
    await this.decryptCredentials(credentials);
    return credentials;
  }

  async fetchById(id: number) {
    this.loggerService.log('fetchById...');

    const credential = await this.credentialsRepository.fetchById(id);
    if (!credential) this.errorHandlerService.notFoundException('Id not found');

    await this.decryptCredential(credential);
    return credential;
  }

  async update(updateCredentialRequestDto: UpdateCredentialRequestDto) {
    this.loggerService.log('update...');

    const { id } = updateCredentialRequestDto;
    const credentialDB = await this.credentialsRepository.fetchById(id);
    if (!credentialDB)
      this.errorHandlerService.notFoundException('Id not found');

    const credential = this.classMapper.map(
      updateCredentialRequestDto,
      UpdateCredentialRequestDto,
      Credential,
    );

    console.log('credential: ', credential);

    if (credential.provider.toLocaleLowerCase() === Providers.Mystifly) {
      const { accountNumber, username, password } = credential;
      const mystiflyCreateSessionResponse =
        await this.mystiflyFlightUtilsService.createSession({
          accountNumber,
          username,
          password,
        });
      if (mystiflyCreateSessionResponse.Success)
        credential.bearer = mystiflyCreateSessionResponse.Data.SessionId;
    }

    await this.encryptCredential(credential);
    return await this.credentialsRepository.update(credential);
  }

  async deleteById(id: number) {
    this.loggerService.log('deleteById...');

    const credential = await this.credentialsRepository.fetchById(id);
    if (!credential) this.errorHandlerService.notFoundException('Id not found');

    const isSuccess = await this.credentialsRepository.deleteById(id);
    if (!isSuccess)
      this.errorHandlerService.internalServerErrorException('Delete failed!');

    return 'Delete successful!';
  }

  async fetchByProvider(provider: Providers) {
    this.loggerService.log('fetchByProvider...');

    const cachedData: Credential = await this.cacheManager.get(
      'mystiflyCredential',
    );
    if (cachedData) {
      this.loggerService.log('get cache...');
      return cachedData;
    }

    const credential = await this.credentialsRepository.fetchByProvider(
      provider,
    );
    await this.decryptCredential(credential);
    await this.cacheManager.set('mystiflyCredential', credential);
    return credential;
  }
}
