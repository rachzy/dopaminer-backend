import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskDuration } from './duration.entity';

export const taskDifficulties = {
  1: 'Very easy',
  2: 'Easy',
  3: 'Moderated',
  4: 'Hard',
  5: 'Very hard',
};

export const taskActivties = {
  1: 'Study',
  2: 'Physical Activity',
  3: 'House task',
};

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 256 })
  title: string;

  @Column('int')
  difficulty: number;

  @Column('date')
  date: string;

  @Column('int')
  activity: number;

  @Column('timestamp with time zone', { default: 'NOW()' })
  createdAt: string;

  @OneToOne(() => TaskDuration, (taskDuration) => taskDuration.task)
  duration: TaskDuration;

  @Column('boolean', { default: false })
  completed: boolean;

  @ManyToOne(() => User, (user) => user.tasks)
  @JoinColumn()
  user: User;

  constructor(task: Partial<Task>) {
    Object.assign(this, task);
  }
}
