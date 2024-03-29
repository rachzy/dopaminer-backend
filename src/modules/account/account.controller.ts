import {
  Body,
  Controller,
  Post,
  Req,
  Get,
  UseGuards,
  ConflictException,
  UsePipes,
} from '@nestjs/common';
import { createAccount } from './dto/create-account.dto';
import { AccountService } from './account.service';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { Request } from 'express';
import { UnauthGuard } from 'src/guards/unauth/unauth.guard';
import { ZodValidationPipe } from 'src/pipes/zodValidation.pipe';
import { createAccountSchema } from './pipes/createAccount.pipe';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('create')
  @UsePipes(new ZodValidationPipe(createAccountSchema))
  @UseGuards(UnauthGuard)
  async createAccount(@Body() account: createAccount) {
    const searchForAccountWithEmail =
      await this.accountService.findAccountByEmail(account.email, true);

    if (searchForAccountWithEmail) {
      throw new ConflictException('This email is already in use by an user.');
    }

    return await this.accountService.createAccount(account);
  }

  @Get('getData')
  @UseGuards(AuthGuard)
  async getAccount(@Req() request: Request) {
    const { USER_ID } = request.cookies;
    return await this.accountService.findAccountById(parseInt(USER_ID));
  }

  @Post('verify')
  @UseGuards(AuthGuard)
  async verifyAccount(@Req() request: Request) {
    const { USER_ID } = request.cookies;

    const account = await this.accountService.findAccountById(
      parseInt(USER_ID),
    );
    const checkForDoubleAccount = await this.accountService.findAccountByEmail(
      account.email,
      true,
    );

    if (checkForDoubleAccount) {
      throw new ConflictException(
        'Já existe uma conta verificada com este e-mail!',
      );
    }

    await this.accountService.verifyAccount(parseInt(USER_ID));
    return {
      message: 'Conta verificada com sucesso!',
    };
  }
}
