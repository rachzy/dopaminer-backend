import { Account } from 'src/modules/account/entities/account.entity';
import { Task } from 'src/modules/task/entities/task.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  accountId: number;

  @Column({ length: 32 })
  username: string;

  @Column('date')
  birthday: string;

  @Column({ length: 128, default: 'default_pfp.png' })
  profilePicture: string;

  @OneToOne(() => Account, (account) => account.user)
  @JoinColumn()
  account: Account;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
}
