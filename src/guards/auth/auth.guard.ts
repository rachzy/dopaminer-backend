import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { SessionService } from 'src/modules/session/session.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly sessionService: SessionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest() as Request;
    const response = ctx.getResponse() as Response;

    function errorCallback({ message }: { message: string }) {
      response.clearCookie('USER_ID', {
        sameSite: 'none',
        secure: true,
        httpOnly: true,
      });
      response.clearCookie('SESSION_ID', {
        sameSite: 'none',
        secure: true,
        httpOnly: true,
      });
      response.clearCookie('SESSION_TOKEN', {
        sameSite: 'none',
        secure: true,
        httpOnly: true,
      });
      throw new UnauthorizedException(message);
    }

    const { USER_ID, SESSION_ID, SESSION_TOKEN } = request.cookies;

    if (!USER_ID || !SESSION_ID || !SESSION_TOKEN) {
      errorCallback({
        message: 'You have to be authenticated to access this resource!',
      });
      return false;
    }

    const validSession = await this.sessionService.validateSession({
      USER_ID,
      SESSION_ID,
      SESSION_TOKEN,
    });

    if (!validSession) {
      errorCallback({
        message: 'Your session is no longer valid. Please, re-authenticate.',
      });
      return false;
    }

    return true;
  }
}
