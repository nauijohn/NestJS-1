import { Injectable } from '@nestjs/common';

import { MyLoggerService } from '../../utils/my-logger.service';
import { CreateFacebookUserRequestDto } from './dtos/request/create-facebook-user-request.dto';
import { FacebookUsersRepository } from './facebook-users.repository';

@Injectable()
export class FacebookUsersService {
  constructor(
    private readonly facebookUsersRepository: FacebookUsersRepository,
    private readonly loggerService: MyLoggerService,
  ) {}

  async create(createFacebookUserRequestDto: CreateFacebookUserRequestDto) {
    this.loggerService.log('create...');
    return await this.facebookUsersRepository.create(
      createFacebookUserRequestDto,
    );
  }

  async findById(id: string) {
    this.loggerService.log('findById...');
    return await this.facebookUsersRepository.findById(id);
  }

  async findByFacebookId(facebookId: string) {
    this.loggerService.log('findUserByFacebookId...');
    return await this.facebookUsersRepository.findByFacebookId(facebookId);
  }

  async fetchByIdWithRoles(id: string) {
    return await this.facebookUsersRepository.fetchUserByIdWithRoles(id);
  }

  async updateUserRole(userId: string, userRoleId: string) {
    return await this.facebookUsersRepository.updateUserRole(
      userId,
      userRoleId,
    );
  }

  async isEmailExists(email: string) {
    this.loggerService.log('isEmailExists...');
    const user = await this.facebookUsersRepository.findByEmail(email);
    return user ? true : false;
  }

  async findByEmail(email: string) {
    this.loggerService.log('findByEmail...');
    return await this.facebookUsersRepository.findByEmail(email);
  }
}
