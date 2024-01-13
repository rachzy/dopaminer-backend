import {
  Inject,
  Injectable,
  PipeTransform,
  PreconditionFailedException,
  Scope,
} from '@nestjs/common';
import { TaskService } from '../../task.service';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class CheckTaskCompletionPipe implements PipeTransform {
  constructor(
    @Inject(REQUEST) protected readonly request: Request,
    private readonly taskService: TaskService,
  ) {}

  async transform(value: any) {
    const id = parseInt(value);
    const { USER_ID } = this.request.cookies;

    const task = await this.taskService.getTaskById(
      parseInt(id.toString()),
      parseInt(USER_ID),
    );

    if (task.completed) {
      throw new PreconditionFailedException(
        'This task has already been completed',
      );
    }

    return value;
  }
}
