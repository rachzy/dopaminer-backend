import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpStatus,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AccountService } from '../account/account.service';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { ZodValidationPipe } from 'src/pipes/zodValidation.pipe';
import { createUserSchema } from './pipes/createUser.pipe';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import multerConfig from 'src/files/multer-config';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly accountService: AccountService,
  ) {}

  @Get('get')
  async getUser(@Query('id', ParseIntPipe) id: number) {
    const user = await this.userService.getUser(id);
    return user;
  }

  @Post('create')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('avatar', multerConfig))
  async createUser(
    @Req() request: Request,
    @Body(new ZodValidationPipe(createUserSchema)) createUserDto: CreateUserDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 10000000 })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    avatar: Express.Multer.File,
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
    const newUser = await this.userService.createUser(
      account,
      createUserDto,
      avatar.filename,
    );
    return newUser;
  }

  @Delete('delete')
  @UseGuards(AuthGuard)
  async deleteUser(@Req() request: Request) {
    const { USER_ID } = request.cookies;
    await this.userService.deleteUser(parseInt(USER_ID));
    return {
      message: 'User successfully deleted!',
    };
  }
}
