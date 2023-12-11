import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { GenericRepository } from '../common/abstracts/generic-repository.abstract';
import { MyLoggerService } from '../utils/my-logger.service';
import { Credential } from './credential.entity';
import { Providers } from './providers.enum';

@Injectable()
export class CredentialsRepository implements GenericRepository<Credential> {
  constructor(
    @InjectRepository(Credential)
    private readonly repository: Repository<Credential>,
    private readonly loggerService: MyLoggerService,
  ) {}

  async create(item: Credential) {
    this.loggerService.log('create...');
    return await this.repository.save(item);
  }

  async fetchAll() {
    this.loggerService.log('fetchAll...');
    return await this.repository.find();
  }

  async fetchById(id: number): Promise<Credential> {
    this.loggerService.log('fetchById...');
    return await this.repository.findOneBy({
      id,
    });
  }

  async update(item: Credential) {
    this.loggerService.log('update...');
    return await this.repository.save(item);
  }

  async deleteById(id: number) {
    this.loggerService.log('deleteById...');
    const { affected } = await this.repository.delete(id);
    if (affected === 1) return true;
    return false;
  }

  async fetchByProvider(provider: Providers) {
    this.loggerService.log('fetchByProvider...');

    return await this.repository.findOneBy({
      provider,
    });
  }
}
