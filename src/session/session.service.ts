import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { EntityManager, Repository } from 'typeorm';
import { SaveSession } from './dto/save-session.dto';
import { Account } from 'src/accounts/entities/account.entity';
import { addDays } from 'date-fns';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionsRepository: Repository<Session>,
    private readonly entityManager: EntityManager,
  ) {}
  async create(ipv4: string, account: Account): Promise<Session> {
    const token = randomBytes(16).toString('hex');

    const creationDate = new Date().toISOString();
    const expirationDate = addDays(Date.now(), 1).toISOString();

    const saveSession: SaveSession = {
      account,
      ipv4,
      token,
      creationDate,
      expirationDate,
    };
    const newSession = new Session(saveSession);

    return this.entityManager.save(newSession);
  }

  async validateSession(USER_ID: string, SESSION_ID: string, SESSION_TOKEN: string)
}
