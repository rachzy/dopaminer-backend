import {
  Body,
  ConflictException,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AccountService } from '../account/account.service';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { ZodValidationPipe } from 'src/pipes/zodValidation.pipe';
import { createUserSchema } from './pipes/createUser.pipe';
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly accountService: AccountService,
  ) {}

  @Get('get')
  async getUser(@Query(ParseIntPipe) id: number) {
    const user = await this.userService.getUser(id);
    return user;
  }

  @Post('create')
  @UseGuards(AuthGuard)
  async createUser(
    @Req() request: Request,
    @Body(new ZodValidationPipe(createUserSchema)) createUserDto: CreateUserDto,
  ) {
    const { USER_ID } = request.cookies;
    const checkForExistingUser = await this.getUser(parseInt(USER_ID));

    if (checkForExistingUser) {
      throw new ConflictException(
        'This account already has a registered user!',
      );
    }

    const account = await this.accountService.findAccountById(
      parseInt(USER_ID),
    );
    const newUser = await this.userService.createUser(account, createUserDto);
    return newUser;
  }
}
