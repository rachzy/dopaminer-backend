import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { createAccount } from './dto/create-account.dto';
import { Account } from './entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly entityManager: EntityManager,
  ) {}

  async createAccount(account: createAccount) {
    const newAccount = new Account(account);
    return await this.entityManager.save(newAccount);
  }

  async findAccount(id: number): Promise<Account> {
    return await this.accountRepository.findOneBy({ id });
  }
}
