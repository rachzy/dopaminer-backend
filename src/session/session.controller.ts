import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { SessionService } from './session.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { AccountService } from 'src/accounts/account.service';

@Controller('session')
export class SessionController {
  constructor(
    private readonly accountService: AccountService,
    private readonly sessionService: SessionService,
  ) {}

  @Post('create')
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
}
