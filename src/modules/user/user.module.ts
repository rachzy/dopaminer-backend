import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Account } from '../account/entities/account.entity';
import { AccountService } from '../account/account.service';
import { SessionService } from '../session/session.service';
import { Session } from '../session/entities/session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Account, Session])],
  controllers: [UserController],
  providers: [UserService, AccountService, SessionService],
})
export class UserModule {}
