import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { Request } from 'express';
import { ZodValidationPipe } from 'src/pipes/zodValidation.pipe';
import { CreateTaskDto } from './dto/create-task.dto';
import { UserService } from '../user/user.service';
import { Task } from './entities/task.entity';
import { ValidUserInterceptor } from 'src/interceptors/valid-user/valid-user.interceptor';
import { CheckTaskViabilityPipe } from './pipes/check-task-viability/check-task-viability.pipe';
import { createTaskSchema } from './pipes/create-task/create-task.pipe';
import { editTaskSchema } from './pipes/edit-task/edit-task.pipe';
import { CheckTaskCompletionPipe } from './pipes/check-task-completion/check-task-completion.pipe';

@Controller('task')
@UseGuards(AuthGuard)
@UseInterceptors(ValidUserInterceptor)
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly userService: UserService,
  ) {}

  @Post('create')
  async createTask(
    @Req() request: Request,
    @Body(new ZodValidationPipe(createTaskSchema)) task: CreateTaskDto,
  ) {
    const { USER_ID } = request.cookies;
    const user = await this.userService.getUser(parseInt(USER_ID));
    return await this.taskService.createTask(user, task);
  }

  @Get('get')
  async getTask(
    @Req() request: Request,
    @Query('id', ParseIntPipe, CheckTaskViabilityPipe) id: number,
  ) {
    const { USER_ID } = request.cookies;
    const task = await this.taskService.getTaskById(id, parseInt(USER_ID));
    return task;
  }

  @Get('getAll')
  async getAllTasks(
    @Query('completed', new DefaultValuePipe(false), ParseBoolPipe)
    completed: boolean,
    @Query('lastWeek', new DefaultValuePipe(false), ParseBoolPipe)
    lastWeek: boolean,
    @Req() request: Request,
  ) {
    const { USER_ID } = request.cookies;

    if (completed) {
      if (lastWeek) {
        return await this.taskService.getAllCompletedTasksOnCurrentWeek(
          parseInt(USER_ID),
        );
      }
      return await this.taskService.getAllCompletedTasks(parseInt(USER_ID));
    }

    const tasks = await this.taskService.getAllTasks(parseInt(USER_ID));
    return tasks;
  }

  @Put('edit')
  async editTask(
    @Query('id', ParseIntPipe, CheckTaskViabilityPipe) taskId: number,
    @Body(new ZodValidationPipe(editTaskSchema))
    task: Partial<Task>,
  ) {
    const patchedTask = await this.taskService.editTask(taskId, task);
    return patchedTask;
  }

  @Patch('complete')
  async completeTask(
    @Query('id', ParseIntPipe, CheckTaskViabilityPipe, CheckTaskCompletionPipe)
    taskId: number,
  ) {
    const patchedTask = await this.taskService.setTaskCompleted(taskId);
    return patchedTask;
  }

  @Delete('delete')
  async deleteTask(
    @Query('id', ParseIntPipe, CheckTaskViabilityPipe) taskId: number,
  ) {
    const result = await this.taskService.deleteTask(taskId);
    return result;
  }
}
