import {
  Body,
  Controller,
  Post,
  ParseIntPipe,
  Query,
  Get,
} from '@nestjs/common';
import { createAccount } from './dto/create-account.dto';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('create')
  async createAccount(@Body() account: createAccount) {
    return await this.accountService.createAccount(account);
  }

  @Get('get')
  async getAccount(@Query('id', ParseIntPipe) id: number) {
    return await this.accountService.findAccount(id);
  }
}
