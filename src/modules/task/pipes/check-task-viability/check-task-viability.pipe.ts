import {
  Inject,
  Injectable,
  NotFoundException,
  PipeTransform,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { TaskService } from '../../task.service';

@Injectable({ scope: Scope.REQUEST })
export class CheckTaskViabilityPipe implements PipeTransform {
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

    if (!task) {
      throw new NotFoundException('Invalid Task!');
    }

    return value;
  }
}
