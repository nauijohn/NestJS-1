import { config as dotenvConfig } from 'dotenv';

import { ConfigModule, ConfigService, registerAs } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';

import {
  POSTGRES,
  POSTGRES_DATABASE,
  POSTGRES_HOST,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  POSTGRES_SYNCHRONIZE,
  POSTGRES_USERNAME,
  TYPEORM_OPTIONS,
} from './config.constant';

dotenvConfig({ path: `.env.${process.env.STAGE}.${process.env.ENV}` });
const configService = new ConfigService();

export const typeormOpts: TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> =
  {
    type: POSTGRES,
    host: configService.get(POSTGRES_HOST),
    port: +configService.get(POSTGRES_PORT),
    username: configService.get(POSTGRES_USERNAME),
    password: configService.get(POSTGRES_PASSWORD),
    database: configService.get(POSTGRES_DATABASE),
    synchronize: configService.get(POSTGRES_SYNCHRONIZE),
    migrations: ['dist/database/migrations/*{.ts,.js}'],
    migrationsTableName: 'migrations_typeorm',
    migrationsRun: true,
    entities: ['dist/**/*.entity{.ts,.js}'],
    autoLoadEntities: true,
    ssl: true,
    extra: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  };

export const typeormConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) =>
    configService.get(TYPEORM_OPTIONS),
};

export default registerAs(TYPEORM_OPTIONS, () => typeormOpts);
