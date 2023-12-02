import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
  lastAuthentication: number;

  @Column('timestamp with time zone', { default: 'NOW()' })
  lastConnection: Date;

  constructor(account: Partial<Account>) {
    Object.assign(this, account);
  }
}
