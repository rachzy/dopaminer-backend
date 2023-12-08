import { Body, Controller, Post, Req, Get, UseGuards } from '@nestjs/common';
import { createAccount } from './dto/create-account.dto';
import { AccountService } from './account.service';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { Request } from 'express';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('create')
  async createAccount(@Body() account: createAccount) {
    return await this.accountService.createAccount(account);
  }

  @Get('getData')
  @UseGuards(AuthGuard)
  async getAccount(@Req() request: Request) {
    const { USER_ID } = request.cookies;
    return await this.accountService.findAccount(parseInt(USER_ID));
  }
}
