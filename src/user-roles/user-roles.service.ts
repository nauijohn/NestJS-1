import { Injectable } from '@nestjs/common';

import { SignAs } from '../auth/enums/sign-as.enum';
import { FacebookUsersService } from '../users/facebook-users/facebook-users.service';
import { LocalUsersService } from '../users/local-users/local-users.service';
import { ErrorHandlerService } from '../utils/error-handler.service';
import { MyLoggerService } from '../utils/my-logger.service';
import { CreateUserRoleRequestDto } from './dtos/request/create-user-role-request.dto';
import { UserRolesRepository } from './user-roles.repository';

@Injectable()
export class UserRolesService {
  constructor(
    private readonly userRolesRepository: UserRolesRepository,
    private readonly localUsersService: LocalUsersService,
    private readonly facebookUsersService: FacebookUsersService,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {}

  async create(createUserRoleRequestDto: CreateUserRoleRequestDto) {
    this.loggerService.log('create...');

    let usersService: LocalUsersService | FacebookUsersService = null;
    if (createUserRoleRequestDto.signAs === SignAs.LocalUser) {
      usersService = this.localUsersService;
    }
    if (createUserRoleRequestDto.signAs === SignAs.FacebookUser) {
      usersService = this.facebookUsersService;
    }

    const { userId, role } = createUserRoleRequestDto;

    const { roles } = await usersService.fetchByIdWithRoles(userId);

    if (roles.includes(role))
      this.errorHandlerService.conflictException(`User already a ${role}`);

    const userRole = await this.userRolesRepository.create(
      createUserRoleRequestDto,
    );
    this.loggerService.debug(`userRole: ${JSON.stringify(userRole)}`);
    const updateUserRoleResult = await usersService.updateUserRole(
      createUserRoleRequestDto.userId,
      userRole.id,
    );
    if (!updateUserRoleResult)
      this.errorHandlerService.internalServerErrorException(
        'update UserRole error',
      );

    return userRole;
  }

  async findUserRoleByUserId(userId: string) {
    this.loggerService.log('findUserRoleByUserId...');
    this.loggerService.debug('userId: ', userId);
    const x = await this.userRolesRepository.findUserRoleByUserId(userId);
    this.loggerService.debug('x: ', x);
    return x;
  }

  async fetchUserRoleById(id: string) {
    this.loggerService.log('fetchUserRoleById...');
    const result = await this.userRolesRepository.fetchUserRoleById(id);
    if (!result) this.errorHandlerService.notFoundException();
    return result;
  }
}
