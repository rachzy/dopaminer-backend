import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { AccountService } from 'src/modules/account/account.service';
import { Account } from 'src/modules/account/entities/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Session, Account])],
  controllers: [SessionController],
  providers: [AccountService, SessionService],
})
export class SessionModule {}
