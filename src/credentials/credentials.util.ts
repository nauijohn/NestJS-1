import { createCipheriv, createDecipheriv, scrypt } from 'crypto';
import { promisify } from 'util';

import { ConfigService } from '@nestjs/config';

import {
  CREDENTIALS_IV,
  CREDENTIALS_PASSWORD,
  CREDENTIALS_SALT,
} from '../config/config.constant';
import { MyLoggerService } from '../utils/my-logger.service';
import { Credential } from './credential.entity';

export class CredentialsUtil {
  constructor(
    private readonly loggerServiceUtil: MyLoggerService,
    private readonly configServiceUtil: ConfigService,
  ) {}

  private async encryptWord(word: string) {
    this.loggerServiceUtil.log('encryptWord...');

    if (!word) return null;
    const { iv, key } = await this.cryptConstants();
    const cipher = createCipheriv('aes-256-ctr', key, iv);
    const encryptedText = Buffer.concat([cipher.update(word), cipher.final()]);
    return encryptedText.toString('base64');
  }

  private async decryptWord(encryptedWord: string) {
    this.loggerServiceUtil.log('decryptWord...');

    if (!encryptedWord) return null;
    const { iv, key } = await this.cryptConstants();
    const decipher = createDecipheriv('aes-256-ctr', key, iv);
    const decryptedText = Buffer.concat([
      decipher.update(Buffer.from(encryptedWord, 'base64')),
      decipher.final(),
    ]);
    return decryptedText.toString();
  }

  private async cryptConstants() {
    const iv = Buffer.from(
      `${this.configServiceUtil.get(CREDENTIALS_IV)}`,
      'hex',
    );
    const key = (await promisify(scrypt)(
      `${this.configServiceUtil.get(CREDENTIALS_PASSWORD)}`,
      `${this.configServiceUtil.get(CREDENTIALS_SALT)}`,
      32,
    )) as Buffer;
    return { iv, key };
  }

  protected async encryptCredential(credential: Credential) {
    const [
      encryptedAccountNumber,
      encryptedBearer,
      encryptedClientId,
      encryptedClientSecret,
      encryptedPassword,
      // encryptedUsername,
    ] = await Promise.all([
      this.encryptWord(credential.accountNumber),
      this.encryptWord(credential.bearer),
      this.encryptWord(credential.clientId),
      this.encryptWord(credential.clientSecret),
      this.encryptWord(credential.password),
      // this.encryptWord(credential.username),
    ]);
    credential.accountNumber = encryptedAccountNumber;
    credential.bearer = encryptedBearer;
    credential.clientId = encryptedClientId;
    credential.clientSecret = encryptedClientSecret;
    credential.password = encryptedPassword;
    // credential.username = encryptedUsername;
  }

  protected async decryptCredential(credential: Credential) {
    const [
      accountNumber, //
      bearer,
      clientId,
      clientSecret,
      password,
      // username, //
    ] = await Promise.all([
      this.decryptWord(credential.accountNumber), //
      this.decryptWord(credential.bearer),
      this.decryptWord(credential.clientId),
      this.decryptWord(credential.clientSecret),
      this.decryptWord(credential.password),
      // this.decryptWord(credential.username), //
    ]);
    credential.accountNumber = accountNumber; //
    credential.bearer = bearer;
    credential.clientId = clientId;
    credential.clientSecret = clientSecret;
    credential.password = password;
    // credential.username = username; //
  }

  protected async decryptCredentials(credentials: Credential[]) {
    await Promise.all(
      credentials.map((credential) => this.decryptCredential(credential)),
    );
  }
}
