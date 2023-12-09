import { Session } from 'src/modules/session/entities/session.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 128,
  })
  email: string;

  @Column({
    length: 255,
  })
  password: string;

  @Column('timestamp with time zone', { default: 'NOW()' })
  lastAuthentication: string;

  @Column('timestamp with time zone', { default: 'NOW()' })
  lastConnection: string;

  @Column('boolean', { default: false })
  verified: boolean;

  @OneToMany(() => Session, (session) => session.account)
  sessions: Session[];

  @OneToOne(() => User, (user) => user.account, { cascade: true })
  user: User;

  constructor(account: Partial<Account>) {
    Object.assign(this, account);
  }
}
