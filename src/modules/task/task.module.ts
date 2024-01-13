import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { User } from '../user/entities/user.entity';
import { TaskDuration } from './entities/duration.entity';
import { SessionService } from '../session/session.service';
import { Session } from '../session/entities/session.entity';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Session, User, TaskDuration, Task]),
  ],
  controllers: [TaskController],
  providers: [TaskService, SessionService, UserService],
})
export class TaskModule {}
