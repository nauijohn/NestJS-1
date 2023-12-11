import { RedisStore, redisStore } from 'cache-manager-redis-yet';
import { RedisClientType } from 'redis';

import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { REDIS_HOST, REDIS_PORT, REDIS_TTL } from './config.constant';

type CacheConfig = CacheModuleAsyncOptions<{
  store: () => Promise<RedisStore<RedisClientType>>;
  ttl: number;
  isGlobal: true;
}>;

export const cacheConfig: CacheConfig = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    store: async () =>
      await redisStore({
        socket: {
          host: configService.get(REDIS_HOST),
          port: +configService.get(REDIS_PORT),
        },
      }),
    ttl: +configService.get(REDIS_TTL),
    isGlobal: true,
  }),
};
