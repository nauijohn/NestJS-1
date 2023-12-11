import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { ErrorHandlerService } from '../../utils/error-handler.service';
import { MyLoggerService } from '../../utils/my-logger.service';
import { CreateTravelerDetailRequestDto } from './dtos/request/create-traveler-details-request.dto';
import { UpdateTravelerDetailRequestDto } from './dtos/request/update-traveler-details-request.dto';
import { TravelerDetailDto } from './dtos/traveler-detail.dto';
import { TravelerDetailsRepository } from './traveler-details.repository';

@Injectable()
export class TravelerDetailsService {
  constructor(
    @Inject(REQUEST) private readonly request: RequestWithUser,
    private readonly travelerDetailsRepository: TravelerDetailsRepository,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {}

  async createUserTravelerDetails(
    createTravelerDetailsRequestDto: CreateTravelerDetailRequestDto[],
  ) {
    this.loggerService.log('createTravelerDetail...');
    createTravelerDetailsRequestDto.forEach((dto) => {
      dto.user = dto.user ?? this.request.user.id;
      dto.signAs = dto.signAs ?? this.request.user.signAs;
    });
    return await this.travelerDetailsRepository.create(
      createTravelerDetailsRequestDto,
    );
  }

  async fetchAllUserTravelerDetails() {
    this.loggerService.log('fetchByUserId...');
    return await this.travelerDetailsRepository.fetchAllUserTravelerDetails();
  }

  async fetchUserTravelerDetailById(id: string) {
    this.loggerService.log('fetchByUserId...');
    const travelerDetails =
      await this.travelerDetailsRepository.fetchUserTravelerDetailById(id);
    if (!travelerDetails)
      this.errorHandlerService.unauthorizedException(
        'Travel detail id is not owned by user',
      );
    return travelerDetails;
  }

  async updateUserTravelerDetails(
    updateTravelerDetailRequestDto: UpdateTravelerDetailRequestDto[],
  ) {
    this.loggerService.log('updateById...');

    const travelerDetailsInDB = await Promise.all(
      updateTravelerDetailRequestDto.map((dto) =>
        this.travelerDetailsRepository.fetchUserTravelerDetailById(dto.id),
      ),
    );
    if (travelerDetailsInDB.every((result) => result === null))
      this.errorHandlerService.unauthorizedException(
        'Travel detail ids are not owned by user',
      );

    if (updateTravelerDetailRequestDto.length !== travelerDetailsInDB.length)
      throw this.errorHandlerService.badRequestException(
        'RequestBody is not equal to number of found data in db',
      );

    this.authenticateUserTravelerDetails(travelerDetailsInDB);

    const { sortedTravelerDetailsInDB, sortedUpdateTravelerDetailRequestDto } =
      this.sortTravelerInputs(
        updateTravelerDetailRequestDto,
        travelerDetailsInDB,
      );

    const requestBody = this.autoDetectChanges(
      sortedUpdateTravelerDetailRequestDto,
      sortedTravelerDetailsInDB,
    );

    const updateManyResult = await Promise.all(
      requestBody.map((dto) => this.travelerDetailsRepository.update(dto)),
    );
    const result = updateManyResult.every(
      (updateResult) => updateResult === true,
    );
    if (!result)
      this.errorHandlerService.internalServerErrorException(
        'Error in traveler detail update',
      );

    return result;
  }

  async deleteUserTravelerDetailById(id: string) {
    this.loggerService.log('deleteById...');
    const userTravelerDetail =
      await this.travelerDetailsRepository.fetchUserTravelerDetailById(id);
    if (!userTravelerDetail)
      this.errorHandlerService.unauthorizedException(
        'Travel detail id is not owned by user',
      );
    const result =
      await this.travelerDetailsRepository.deleteUserTravelerDetailById(id);
    if (!result)
      this.errorHandlerService.internalServerErrorException(
        'Error in traveler detail delete',
      );
    return result;
  }

  private authenticateUserTravelerDetails(
    travelerDetailsInDB: TravelerDetailDto[],
  ) {
    this.loggerService.log('authenticateUserTravelerDetails...');
    for (let i = 0; i < travelerDetailsInDB.length; i++) {
      if (travelerDetailsInDB[i].user.toString() !== this.request.user.id)
        throw this.errorHandlerService.unauthorizedException(
          "Update other user's travel details not allowed.",
        );
    }
  }

  private autoDetectChanges(
    updateTravelerDetailsRequestDto: UpdateTravelerDetailRequestDto[],
    travelerDetailsInDB: TravelerDetailDto[],
  ) {
    const result: UpdateTravelerDetailRequestDto[] = [];
    for (let i = 0; i < updateTravelerDetailsRequestDto.length; i++) {
      if (updateTravelerDetailsRequestDto[i].id !== travelerDetailsInDB[i].id)
        throw this.errorHandlerService.internalServerErrorException(
          'Details not sorted properly',
        );
      if (
        updateTravelerDetailsRequestDto[i].user !== travelerDetailsInDB[i].user
      )
        throw this.errorHandlerService.badRequestException(
          'Updated user travel details not allowed',
        );

      result.push({
        id: updateTravelerDetailsRequestDto[i].id,
        birthDate:
          updateTravelerDetailsRequestDto[i].birthDate ??
          travelerDetailsInDB[i].birthDate,
        email:
          updateTravelerDetailsRequestDto[i].email ??
          travelerDetailsInDB[i].email,
        expirationDate:
          updateTravelerDetailsRequestDto[i].expirationDate ??
          travelerDetailsInDB[i].expirationDate,
        firstName:
          updateTravelerDetailsRequestDto[i].firstName ??
          travelerDetailsInDB[i].firstName,
        lastName:
          updateTravelerDetailsRequestDto[i].lastName ??
          travelerDetailsInDB[i].lastName,
        // gender:
        //   updateTravelerDetailsRequestDto[i].gender ??
        //   travelerDetailsInDB[i].gender,
        title:
          updateTravelerDetailsRequestDto[i].title ??
          travelerDetailsInDB[i].title,
        middleName:
          updateTravelerDetailsRequestDto[i].middleName ??
          travelerDetailsInDB[i].middleName,
        nationality:
          updateTravelerDetailsRequestDto[i].nationality ??
          travelerDetailsInDB[i].nationality,
        passportNumber:
          updateTravelerDetailsRequestDto[i].passportNumber ??
          travelerDetailsInDB[i].passportNumber,
        mobileNumber:
          updateTravelerDetailsRequestDto[i].mobileNumber ??
          travelerDetailsInDB[i].mobileNumber,
        signAs:
          updateTravelerDetailsRequestDto[i].signAs ??
          travelerDetailsInDB[i].signAs,
        user:
          updateTravelerDetailsRequestDto[i].user ??
          travelerDetailsInDB[i].user,
      });
    }
    return result;
  }

  private sortTravelerInputs(
    updateTravelerDetailsRequestDto: UpdateTravelerDetailRequestDto[],
    travelerDetailsInDB: TravelerDetailDto[],
  ) {
    return {
      sortedTravelerDetailsInDB: travelerDetailsInDB.sort((a, b) =>
        a.id.localeCompare(b.id),
      ),
      sortedUpdateTravelerDetailRequestDto:
        updateTravelerDetailsRequestDto.sort((a, b) =>
          a.id.localeCompare(b.id),
        ),
    };
  }
}
