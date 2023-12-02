import { Module } from '@nestjs/common';
import { AccountModule } from './accounts/account.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AccountModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
