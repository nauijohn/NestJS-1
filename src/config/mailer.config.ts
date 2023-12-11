import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { MailerAsyncOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-async-options.interface';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { MAILER_HOST, MAILER_PASS, MAILER_USER } from './config.constant';

export const mailerConfig: MailerAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    transport: {
      host: configService.get(MAILER_HOST),
      secure: false,
      auth: {
        user: configService.get(MAILER_USER),
        pass: configService.get(MAILER_PASS),
      },
    },
    defaults: {
      from: '"nest-modules" <modules@nestjs.com>',
    },
    template: {
      dir: `${__dirname + '/../email-templates'}`,
      adapter: new EjsAdapter(),
      options: {
        strict: true,
      },
    },
  }),
};
