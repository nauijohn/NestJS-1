import { Types } from 'mongoose';

import { ConflictException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { MyLoggerService } from '../../utils/my-logger.service';
import { LocalUserDto } from './dtos/local-user.dto';
import { CreateLocalUserRequestDto } from './dtos/request/create-user-request.dto';
import { LocalUsersRepository } from './local-users.repository';
import { LocalUsersService } from './local-users.service';

const mockUsers: LocalUserDto[] = [
  {
    id: '123456',
    email: 'test1@test.com',
    password: 'P@ssw0rd',
    firstName: 'testUserFirstNameOne',
    lastName: 'testUserLastNameOne',
    middleName: undefined,
    mobileNumber: '+639999999999',
    birthDate: '1993-06-09',
    roles: ['test']
  },
  {
    id: '7891011',
    email: 'test2@test.com',
    password: 'P@ssw0rd',
    firstName: 'testUserFirstNametwo',
    lastName: 'testUserLastNametwo',
    middleName: undefined,
    mobileNumber: '+639998888888',
    birthDate: '1995-03-05',
    roles: ['test']
  },
];

const mockUsersRepository = () => ({
  create: jest.fn(async (userRequest: CreateLocalUserRequestDto) => {
    const user = mockUsers.find((user) => user.email === userRequest.email);
    if (user) throw new ConflictException('Email already exists');
    return { ...userRequest, id: mockObjectId };
  }),
  findByEmail: jest.fn(async (email: string) =>
    mockUsers.find((user) => user.email === email),
  ),

  findWithPasswordByEmail: jest.fn(async (email: string) =>
    mockUsers.find((user) => user.email === email),
  ),

  findById: jest.fn(async (id: string) =>
    mockUsers.find((user) => user.id === id),
  ),
});

const mockLoggerService = () => ({
  log: jest.fn(),
  debug: jest.fn(),
  verbose: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
});

const mockObjectId = new Types.ObjectId().toString();

const userDtoResult: LocalUserDto = {
  id: '123456',
  email: 'test1@test.com',
  password: 'P@ssw0rd',
  firstName: 'testUserFirstNameOne',
  lastName: 'testUserLastNameOne',
  middleName: undefined,
  mobileNumber: '+639999999999',
  birthDate: '1993-06-09',
  roles: ['test']
};

const mockCreateUsersRepositoryRequest: CreateLocalUserRequestDto = {
  email: 'test@test.com',
  password: 'P@ssw0rd',
  firstName: 'firstName2',
  lastName: 'lastName2',
  middleName: 'middleName2',
  mobileNumber: '+639999999999',
  birthDate: '1993-06-09',
};

describe('UsersService', () => {
  let usersService: LocalUsersService;
  let usersRepository: LocalUsersRepository;
  let loggerService: MyLoggerService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        LocalUsersService,
        { provide: LocalUsersRepository, useFactory: mockUsersRepository },
        { provide: MyLoggerService, useFactory: mockLoggerService },
      ],
    }).compile();

    usersService = module.get<LocalUsersService>(LocalUsersService);
    usersRepository = module.get<LocalUsersRepository>(LocalUsersRepository);
    loggerService = module.get<MyLoggerService>(MyLoggerService);
  });

  describe('usersService', () => {
    it('should be defined', () => {
      expect(usersService).toBeDefined();
    });
  });

  describe('dependencies', () => {
    test('usersRepository should be defined', () => {
      expect(usersRepository).toBeDefined();
    });

    test('loggerService should be defined', () => {
      expect(loggerService).toBeDefined();
    });
  });

  describe('create', () => {
    it('should create user successfully', async () => {
      const result = await usersService.create(
        mockCreateUsersRepositoryRequest,
      );
      expect(loggerService.log).toHaveBeenCalled();
      expect(result).toMatchObject({
        ...mockCreateUsersRepositoryRequest,
        id: mockObjectId,
      });
    });

    it('should throw error due to email already exists', async () => {
      jest.spyOn(usersRepository, 'create').mockImplementationOnce(async () => {
        throw new ConflictException();
      });
      try {
        await usersService.create({
          email: 'test1@test.com',
          password: 'P@ssw0rd',
          firstName: 'testUserFirstName',
          lastName: 'testUserLastName',
          middleName: 'testMiddleName',
          mobileNumber: '+639999999999',
          birthDate: '1993-06-09',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
      }
    });
  });

  describe('isEmailExists', () => {
    describe('usersRepository.findByEmail returns a user', () => {
      it('should return true', async () => {
        const result = await usersService.isEmailExists('test1@test.com');
        expect(loggerService.log).toHaveBeenCalled();
        expect(result).toEqual(true);
      });
    });

    describe('usersRepository.findByEmail does not return a user', () => {
      it('should return false', async () => {
        const result = await usersService.isEmailExists('test4@test.com');
        expect(loggerService.log).toHaveBeenCalled();
        expect(result).toEqual(false);
      });
    });
  });

  describe('findByEmail', () => {
    it('should find a user by email successfully', async () => {
      const result = await usersService.findByEmail('test1@test.com');

      expect(result).toEqual(userDtoResult);
    });

    it('should not find a user', async () => {
      const result = await usersService.findByEmail('test@test');
      expect(result).toBeFalsy();
    });
  });

  describe('findWithPasswordByEmail', () => {
    describe('usersRepository.findWithPasswordByEmail returns a user', () => {
      it('should return a user', async () => {
        const result = await usersService.findWithPasswordByEmail(
          'test2@test.com',
        );

        expect(loggerService.log).toHaveBeenCalled();
        expect(result).toBeTruthy();
        expect(result).toHaveProperty('password');
      });
    });

    describe('usersRepository.findWithPasswordByEmail does not return a user', () => {
      it('should be falsy', async () => {
        const result = await usersService.findWithPasswordByEmail(
          'test4@test.com',
        );

        expect(loggerService.log).toHaveBeenCalled();
        expect(result).toBeFalsy();
      });
    });
  });

  describe('findById', () => {
    describe('usersRepository.findById returns a user', () => {
      it('should return a user', async () => {
        const result = await usersService.findById('123456');
        expect(loggerService.log).toHaveBeenCalled();
        expect(result).toBeTruthy();
      });
    });

    describe('usersRepository.findById does not return a user', () => {
      it('should not return a user', async () => {
        const result = await usersService.findById('123452');

        expect(loggerService.log).toHaveBeenCalled();
        expect(result).toBeFalsy();
      });
    });
  });
});
