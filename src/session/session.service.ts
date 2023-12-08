import { BadRequestException, Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { EntityManager, Repository } from 'typeorm';
import { SaveSession } from './dto/save-session.dto';
import { Account } from 'src/accounts/entities/account.entity';
import { addDays } from 'date-fns';
import { CookieSessionDto } from './dto/cookie-session.dto';

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

  async validateSession({
    USER_ID,
    SESSION_ID,
    SESSION_TOKEN,
  }: CookieSessionDto): Promise<boolean> {
    const session = await this.sessionsRepository.findOneBy({
      account: { id: USER_ID },
      id: SESSION_ID,
      token: SESSION_TOKEN,
    });

    if (!session) return false;

    const { expirationDate, valid } = session;

    if (!valid) return false;

    const expirationTimestamp = new Date(expirationDate).getTime();

    if (expirationTimestamp < Date.now()) {
      session.valid = false;
      await this.entityManager.save(session);
      return false;
    }

    return true;
  }

  async destroySession({
    USER_ID,
    SESSION_ID,
    SESSION_TOKEN,
  }: CookieSessionDto) {
    if (!USER_ID || !SESSION_ID || !SESSION_TOKEN) {
      throw new BadRequestException(
        `You don't have a currently active session`,
      );
    }

    const session = await this.sessionsRepository.findOneBy({
      account: { id: USER_ID },
      id: SESSION_ID,
      token: SESSION_TOKEN,
    });

    if (!session) return;
    session.valid = false;
    await this.entityManager.save(session);
  }
}
