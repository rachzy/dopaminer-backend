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

    const pointsByTaskDifficulty = {
      1: 10,
      2: 25,
      3: 50,
      4: 100,
      5: 200,
    };

    const saveTask = {
      ...createTaskDto,
      user: owner,
      duration: newDuration,
      points: pointsByTaskDifficulty[createTaskDto.difficulty],
    };

    const newTask = new Task(saveTask);
    await this.entityManager.save(newTask);

    newDuration.taskId = newTask.id;
    await this.entityManager.save(newDuration);

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

  async getAllCompletedTasks(ownerId: number): Promise<Task[]> {
    const tasks = await this.taskRepository.find({
      where: { user: { accountId: ownerId }, completed: true },
    });
    return tasks;
  }

  async getAllCompletedTasksOnCurrentWeek(ownerId: number): Promise<Task[]> {
    const completedTasks = await this.getAllCompletedTasks(ownerId);

    // Filter all completedTasks by only the ones that have been completed in the last 7 days
    const tasks = completedTasks.filter((task) => {
      const taskDate = new Date(task.dateOfCompletion);
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - 7);
      return taskDate >= currentDate;
    });

    return tasks;
  }

  async editTask(taskId: number, task: Partial<Task>) {
    const newTask: Partial<Task> = {
      ...task,
      id: taskId,
    };
    const patchedTask = new Task(newTask);

    return this.taskRepository.save(patchedTask);
  }

  async setTaskCompleted(taskId: number): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });

    const patchedTask: Partial<Task> = {
      id: taskId,
      completed: true,
      dateOfCompletion: new Date().toISOString(),
      points: task.points,
    };

    return this.taskRepository.save(patchedTask);
  }

  async deleteTask(taskId: number) {
    await this.taskRepository.delete(taskId);
    return {
      message: `Task #${taskId} successfully deleted.`,
    };
  }
}
