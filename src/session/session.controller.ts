import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { SessionService } from './session.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { AccountService } from 'src/accounts/account.service';
import { UnauthGuard } from 'src/guards/unauth/unauth.guard';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { CookieSessionDto } from './dto/cookie-session.dto';

@Controller('session')
export class SessionController {
  constructor(
    private readonly accountService: AccountService,
    private readonly sessionService: SessionService,
  ) {}

  @Post('create')
  @UseGuards(UnauthGuard)
  async create(
    @Req() request: Request,
    @Res() response: Response,
    @Body() createSessionDto: CreateSessionDto,
  ) {
    const { email, password } = createSessionDto;

    const account = await this.accountService.authenticate(email, password);
    if (!account) throw new UnauthorizedException('Invalid user!');

    const ipv4 = request.ip || request.socket.remoteAddress;

    const { id, token, expirationDate } = await this.sessionService.create(
      ipv4,
      account,
    );

    response.cookie('USER_ID', account.id, {
      sameSite: 'none',
      httpOnly: true,
      secure: true,
      expires: new Date(expirationDate),
    });

    response.cookie('SESSION_ID', id, {
      sameSite: 'none',
      httpOnly: true,
      secure: true,
      expires: new Date(expirationDate),
    });

    response.cookie('SESSION_TOKEN', token, {
      sameSite: 'none',
      httpOnly: true,
      secure: true,
      expires: new Date(expirationDate),
    });

    response.send({
      id: account.id,
      lastAuthentication: account.lastAuthentication,
    });
  }

  @Delete('logout')
  @UseGuards(AuthGuard)
  async logout(@Req() request: Request, @Res() response: Response) {
    const { USER_ID, SESSION_ID, SESSION_TOKEN } =
      request.cookies as CookieSessionDto;
    await this.sessionService.destroySession({
      USER_ID,
      SESSION_ID,
      SESSION_TOKEN,
    });

    response.clearCookie('USER_ID');
    response.clearCookie('SESSION_ID');
    response.clearCookie('SESSION_TOKEN');

    response.send({
      message: 'Successfully logged out.',
    });
  }
}
