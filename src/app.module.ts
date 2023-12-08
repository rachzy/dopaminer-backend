import { Module } from '@nestjs/common';
import { AccountModule } from './modules/account/account.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { SessionModule } from './modules/session/session.module';

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
