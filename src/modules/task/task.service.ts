import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskDuration } from './entities/duration.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly entityManager: EntityManager,
  ) {}

  async createTask(
    owner: User,
    createTaskDto: CreateTaskDto,
  ): Promise<Partial<Task>> {
    const newDuration = new TaskDuration(createTaskDto.duration);

    const saveTask = {
      ...createTaskDto,
      user: owner,
      duration: newDuration,
    };

    const newTask = new Task(saveTask);
    await this.entityManager.save(newTask);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { user, ...task } = newTask;

    return task;
  }

  async getAllTasks(ownerId: number): Promise<Task[]> {
    const tasks = await this.taskRepository.find({
      where: { user: { accountId: ownerId } },
    });
    return tasks;
  }

  async getTaskById(id: number, ownerId: number): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id, user: { accountId: ownerId } },
      relations: { duration: true },
    });
    return task;
  }

  async editTask(taskId: number, task: Partial<Task>) {
    const newTask: Partial<Task> = {
      ...task,
      id: taskId,
    };
    const patchedTask = new Task(newTask);

    return this.taskRepository.save(patchedTask);
  }

  async deleteTask(taskId: number) {
    await this.taskRepository.delete(taskId);
    return {
      message: `Task #${taskId} successfully deleted.`,
    };
  }
}
