import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class ValidUserInterceptor implements NestInterceptor {
  constructor(private readonly userService: UserService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest() as Request;
    const { USER_ID } = request.cookies;

    const user = await this.userService.getUser(parseInt(USER_ID));

    if (!user) {
      throw new UnauthorizedException(
        'This resource can only be used by real users.',
      );
    }

    return next.handle();
  }
}
