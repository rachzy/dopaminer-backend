import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { createAccount } from './dto/create-account.dto';
import { Account } from './entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SaveAccount } from './dto/save-account.dto';
import {
  RetrievedAccount,
  RetrievedAccountDto,
} from './dto/retrieved-account.dto';
import { hash, compare, genSaltSync } from 'bcrypt';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly entityManager: EntityManager,
  ) {}

  async createAccount(account: createAccount): Promise<RetrievedAccountDto> {
    const salt = genSaltSync(8);
    const hashedPassword = await hash(account.password, salt);

    const saveAccount: SaveAccount = {
      ...account,
      password: hashedPassword,
      lastAuthentication: new Date().toISOString(),
      lastConnection: new Date().toISOString(),
    };
    const newAccount = new Account(saveAccount);
    await this.entityManager.save(newAccount);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...retrievedAccount } = newAccount;

    return retrievedAccount;
  }

  async authenticate(email: string, password: string): Promise<Account | null> {
    const account = await this.accountRepository.findOne({
      where: { email },
      select: { id: true, password: true },
    });
    if (!account) return null;

    const passwordMatching = await compare(password, account.password);
    if (!passwordMatching) return null;

    const fullAccount = await this.accountRepository.findOneBy({ email });
    fullAccount.lastAuthentication = new Date().toISOString();
    fullAccount.lastConnection = new Date().toISOString();

    await this.accountRepository.update(account.id, account);
    return fullAccount;
  }

  async findAccountById(id: number): Promise<Account> {
    return await this.accountRepository.findOne({
      where: { id },
      select: { ...RetrievedAccount },
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
