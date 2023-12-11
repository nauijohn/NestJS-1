import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import { Credential } from '../credential.entity';
import { CreateCredentialRequestDto } from '../dtos/request/create-credential-request.dto';
import { UpdateCredentialRequestDto } from '../dtos/request/update-credential-request.dto';

@Injectable()
export class CredentialsMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        CreateCredentialRequestDto,
        Credential,
        forMember(
          (destination) => destination.bearer,
          mapFrom((source) => (source.bearer ? source.bearer : null)),
        ),
        forMember(
          (destination) => destination.clientId,
          mapFrom((source) => (source.clientId ? source.clientId : null)),
        ),
        forMember(
          (destination) => destination.clientSecret,
          mapFrom((source) =>
            source.clientSecret ? source.clientSecret : null,
          ),
        ),
        forMember(
          (destination) => destination.password,
          mapFrom((source) => (source.password ? source.password : null)),
        ),
        forMember(
          (destination) => destination.provider,
          mapFrom((source) => source.provider),
        ),
        forMember(
          (destination) => destination.username,
          mapFrom((source) => (source.username ? source.username : null)),
        ),
        forMember(
          (destination) => destination.accountNumber,
          mapFrom((source) =>
            source.accountNumber ? source.accountNumber : null,
          ),
        ),
      );

      createMap(
        mapper,
        UpdateCredentialRequestDto,
        Credential,
        forMember(
          (destination) => destination.id,
          mapFrom((source) => source.id),
        ),
        forMember(
          (destination) => destination.bearer,
          mapFrom((source) => source.bearer),
        ),
        forMember(
          (destination) => destination.clientId,
          mapFrom((source) => source.clientId),
        ),
        forMember(
          (destination) => destination.clientSecret,
          mapFrom((source) => source.clientSecret),
        ),
        forMember(
          (destination) => destination.password,
          mapFrom((source) => source.password),
        ),
        forMember(
          (destination) => destination.provider,
          mapFrom((source) => source.provider),
        ),
        forMember(
          (destination) => destination.username,
          mapFrom((source) => source.username),
        ),
        forMember(
          (destination) => destination.accountNumber,
          mapFrom((source) => source.accountNumber),
        ),
      );
    };
  }
}
