import { Module } from '@nestjs/common';
import { AccountModule } from './accounts/account.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { SessionModule } from './session/session.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AccountModule,
    SessionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
