import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { createAccount } from './dto/create-account.dto';
import { Account } from './entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SaveAccount } from './dto/save-account.dto';
import { RetrievedAccountDto } from './dto/retrieved-account.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly entityManager: EntityManager,
  ) {}

  async createAccount(account: createAccount): Promise<Account> {
    const saveAccount: SaveAccount = {
      ...account,
      lastAuthentication: new Date().toISOString(),
      lastConnection: new Date().toISOString(),
    };
    const newAccount = new Account(saveAccount);

    return await this.entityManager.save(newAccount);
  }

  async authenticate(email: string, password: string): Promise<Account | null> {
    const account = await this.accountRepository.findOneBy({ email, password });
    if (!account) return null;

    account.lastAuthentication = new Date().toISOString();
    account.lastConnection = new Date().toISOString();
    await this.entityManager.save(account);
    return account;
  }

  async findAccountById(id: number): Promise<Account> {
    return await this.accountRepository.findOne({
      where: { id },
      select: { ...RetrievedAccountDto },
    });
  }

  async findAccountByEmail(email: string, verified: boolean): Promise<Account> {
    return await this.accountRepository.findOne({
      where: { email, verified },
      select: { id: true, email: true },
    });
  }

  async verifyAccount(id: number) {
    const account = await this.accountRepository.findOneBy({ id });
    account.verified = true;

    await this.entityManager.save(account);
  }
}
