import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { Account } from './entities/account.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionService } from 'src/modules/session/session.service';
import { Session } from 'src/modules/session/entities/session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account, Session])],
  controllers: [AccountController],
  providers: [AccountService, SessionService],
})
export class AccountModule {}
