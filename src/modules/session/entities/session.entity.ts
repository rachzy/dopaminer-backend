import { Account } from 'src/modules/account/entities/account.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Account, (account) => account.sessions)
  @JoinColumn()
  account: Account;

  @Column({ length: 255 })
  token: string;

  @Column({ length: 16 })
  ipv4: string;

  @Column('timestamp with time zone')
  creationDate: string;

  @Column('timestamp with time zone')
  expirationDate: string;

  @Column('boolean', { default: true })
  valid: boolean;

  constructor(session: Partial<Session>) {
    Object.assign(this, session);
  }
}
