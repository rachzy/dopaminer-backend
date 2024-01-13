import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Task } from './task.entity';

@Entity()
export class TaskDuration {
  @PrimaryColumn()
  taskId: number;

  @Column('int')
  value: number;

  @Column('enum', { enum: ['minutes', 'hours', 'days', 'weeks', 'months'] })
  type: 'minutes' | 'hours' | 'days' | 'weeks' | 'months';

  @OneToOne(() => Task, (task) => task.duration)
  @JoinColumn()
  task: Task;

  constructor(duration: Partial<TaskDuration>) {
    Object.assign(this, duration);
  }
}
