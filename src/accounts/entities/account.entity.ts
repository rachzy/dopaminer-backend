import { Session } from 'src/session/entities/session.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  @OneToMany(() => Session, (session) => session.account)
  sessions: Session[];

  constructor(account: Partial<Account>) {
    Object.assign(this, account);
  }
}
