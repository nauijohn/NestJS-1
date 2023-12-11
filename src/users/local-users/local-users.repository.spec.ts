import { Model, Types } from 'mongoose';

import { classes } from '@automapper/classes';
import { createMapper, Mapper } from '@automapper/core';
import { AutomapperModule, getMapperToken } from '@automapper/nestjs';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { MyLoggerService } from '../../utils/my-logger.service';
import { LocalUserMapperProfile } from './automapper/local-user-mapper.profile';
import { CreateLocalUserRequestDto } from './dtos/request/create-user-request.dto';
import { LocalUser } from './local-user.schema';
import { LocalUsersRepository } from './local-users.repository';

// const mockUserModel = () => ({
//   findOne: jest.fn().mockImplementationOnce(() => ({
//     select: jest.fn().mockResolvedValueOnce({
//       _id: new Types.ObjectId('64bae4ee6c895d0d975c7126'),
//       email: 'testEmailtest22323@test.com',
//       firstName: 'testFirstName',
//       lastName: 'testLastName',
//       mobileNumber: '+639999999999',
//       birthDate: '1990-02-21',
//       createdAt: {
//         $date: '2023-07-21T20:05:02.512Z',
//       },
//       updatedAt: {
//         $date: '2023-07-21T20:05:02.512Z',
//       },
//     }),
//   })),
// });

const mockLoggerService = () => ({
  log: jest.fn(),
  debug: jest.fn(),
  verbose: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
});

describe('UsersRepository', () => {
  let usersRepository: LocalUsersRepository;
  let userModel: Model<LocalUser>;
  let mapper: Mapper;
  let loggerService: MyLoggerService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AutomapperModule],
      providers: [
        LocalUserMapperProfile,
        LocalUsersRepository,
        {
          provide: getMapperToken(),
          useValue: createMapper({ strategyInitializer: classes() }),
        },
        {
          provide: getModelToken(LocalUser.name),
          useValue: Model,
        },
        { provide: MyLoggerService, useFactory: mockLoggerService },
      ],
    }).compile();

    userModel = module.get<Model<LocalUser>>(getModelToken(LocalUser.name));
    usersRepository = module.get<LocalUsersRepository>(LocalUsersRepository);
    mapper = module.get<Mapper>(getMapperToken());
    loggerService = module.get<MyLoggerService>(MyLoggerService);
  });

  it('usersRepository should be defined', () => {
    expect(usersRepository).toBeDefined();
  });

  describe('dependencies', () => {
    describe('mapper', () => {
      it('should be defined', () => {
        expect(mapper).toBeDefined();
      });
    });

    describe('userModel', () => {
      it('should be defined', () => {
        expect(userModel).toBeDefined();
      });
    });

    describe('loggerService', () => {
      it('should be defined', () => {
        expect(loggerService).toBeDefined();
      });
    });
  });

  describe('findByEmail', () => {
    it('should find one', async () => {
      jest.spyOn(userModel, 'findOne').mockImplementationOnce(
        jest.fn().mockImplementationOnce(() => ({
          select: jest.fn().mockResolvedValueOnce({
            _id: new Types.ObjectId('64bae4ee6c895d0d975c7126'),
            email: 'testEmailtest22323@test.com',
            firstName: 'testFirstName',
            lastName: 'testLastName',
            mobileNumber: '+639999999999',
            birthDate: '1990-02-21',
            createdAt: {
              $date: '2023-07-21T20:05:02.512Z',
            },
            updatedAt: {
              $date: '2023-07-21T20:05:02.512Z',
            },
          }),
        })),
      );

      const result = await usersRepository.findByEmail(
        'testEmailtest22323@test.com',
      );
      expect(result).toEqual({
        id: '64bae4ee6c895d0d975c7126',
        email: 'testEmailtest22323@test.com',
        password: undefined,
        firstName: 'testFirstName',
        middleName: undefined,
        lastName: 'testLastName',
        mobileNumber: '+639999999999',
        birthDate: '1990-02-21',
      });
    });

    it('should return null if userModel.findOne returns null', async () => {
      jest.spyOn(userModel, 'findOne').mockImplementationOnce(
        jest.fn().mockImplementationOnce(() => ({
          select: jest.fn().mockResolvedValueOnce(null),
        })),
      );
      const result = await usersRepository.findByEmail(
        'testEmailtest22323@test.com',
      );
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should return created user', async () => {
      jest.spyOn(userModel, 'create').mockImplementationOnce(
        jest.fn().mockImplementationOnce(() => {
          return {
            email: 'testEmailtest6@test.com',
            password:
              '$2b$10$NPNuEzQRI78t5RQJlWGpMu.RQ0ZTMzmES8qLkGt4lXI2jKbI5c/7S',
            firstName: 'testFirstName',
            middleName: null,
            lastName: 'testLastName',
            mobileNumber: '+639999999999',
            birthDate: '1990-02-21',
            _id: '64bd4f21ae97487114da5bce',
            createdAt: '2023-07-23T16:02:41.137Z',
            updatedAt: '2023-07-23T16:02:41.137Z',
            __v: 0,
          };
        }),
      );

      const createUserRequestDto: CreateLocalUserRequestDto = {
        email: 'testEmailtest6@test.com',
        password: 'testPassword!',
        firstName: 'testFirstName',
        middleName: null,
        lastName: 'testLastName',
        mobileNumber: '+639999999999',
        birthDate: '1990-02-21',
      };

      const result = await usersRepository.create(createUserRequestDto);

      expect(result).toEqual({
        email: 'testEmailtest6@test.com',
        password:
          '$2b$10$NPNuEzQRI78t5RQJlWGpMu.RQ0ZTMzmES8qLkGt4lXI2jKbI5c/7S',
        firstName: 'testFirstName',
        middleName: null,
        lastName: 'testLastName',
        mobileNumber: '+639999999999',
        birthDate: '1990-02-21',
        id: '64bd4f21ae97487114da5bce',
      });
    });
  });

  describe('findWithPasswordByEmail', () => {
    describe('success scenario', () => {
      it('should return a user', async () => {
        jest.spyOn(userModel, 'findOne').mockImplementationOnce(
          jest.fn().mockImplementationOnce(() => ({
            select: jest.fn().mockResolvedValueOnce({
              _id: new Types.ObjectId('64bd4f21ae97487114da5bce'),
              email: 'testEmailtest6@test.com',
              password:
                '$2b$10$NPNuEzQRI78t5RQJlWGpMu.RQ0ZTMzmES8qLkGt4lXI2jKbI5c/7S',
              firstName: 'testFirstName',
              middleName: null,
              lastName: 'testLastName',
              mobileNumber: '+639999999999',
              birthDate: '1990-02-21',
              createdAt: {
                $date: '2023-07-23T16:02:41.137Z',
              },
              updatedAt: {
                $date: '2023-07-23T16:02:41.137Z',
              },
            }),
          })),
        );

        const result = await usersRepository.findWithPasswordByEmail(
          'testEmailtest6@test.com',
        );

        expect(result).toEqual({
          id: '64bd4f21ae97487114da5bce',
          email: 'testEmailtest6@test.com',
          password:
            '$2b$10$NPNuEzQRI78t5RQJlWGpMu.RQ0ZTMzmES8qLkGt4lXI2jKbI5c/7S',
          firstName: 'testFirstName',
          middleName: null,
          lastName: 'testLastName',
          mobileNumber: '+639999999999',
          birthDate: '1990-02-21',
        });
      });
    });

    describe('fail scenario', () => {
      it('should return null', async () => {
        jest.spyOn(userModel, 'findOne').mockImplementationOnce(
          jest.fn().mockImplementationOnce(() => ({
            select: jest.fn().mockResolvedValueOnce(null),
          })),
        );

        const result = await usersRepository.findWithPasswordByEmail(
          'testEmailtest6@test.com',
        );

        expect(result).toEqual(null);
      });
    });
  });

  describe('findById', () => {
    describe('success scenario', () => {
      it('should find a user by Id', async () => {
        jest.spyOn(userModel, 'findById').mockImplementationOnce(
          jest.fn().mockImplementationOnce(() => ({
            select: jest.fn().mockResolvedValueOnce({
              _id: new Types.ObjectId('64bd4f21ae97487114da5bce'),
              email: 'testEmailtest6@test.com',
              firstName: 'testFirstName',
              middleName: null,
              lastName: 'testLastName',
              mobileNumber: '+639999999999',
              birthDate: '1990-02-21',
              createdAt: {
                $date: '2023-07-23T16:02:41.137Z',
              },
              updatedAt: {
                $date: '2023-07-23T16:02:41.137Z',
              },
            }),
          })),
        );

        const result = await usersRepository.findById(
          '64bd4f21ae97487114da5bce',
        );

        expect(result).toEqual({
          id: '64bd4f21ae97487114da5bce',
          email: 'testEmailtest6@test.com',
          password: undefined,
          firstName: 'testFirstName',
          middleName: null,
          lastName: 'testLastName',
          mobileNumber: '+639999999999',
          birthDate: '1990-02-21',
        });
      });
    });

    describe('failed scenario', () => {
      it('should return null', async () => {
        jest.spyOn(userModel, 'findById').mockImplementationOnce(
          jest.fn().mockImplementationOnce(() => ({
            select: jest.fn().mockResolvedValueOnce(null),
          })),
        );

        const result = await usersRepository.findById(
          '64bd4f21ae97487114da5bce',
        );

        expect(result).toEqual(null);
      });
    });
  });
});
