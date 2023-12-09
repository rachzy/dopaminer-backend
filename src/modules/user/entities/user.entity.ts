import { Account } from 'src/modules/account/entities/account.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  accountId: number;

  @Column({ length: 32 })
  username: string;

  @Column('date')
  birthday: string;

  @Column({ length: 64, default: 'default_pfp.png' })
  profilePicture: string;

  @OneToOne(() => Account, (account) => account.user)
  @JoinColumn()
  account: Account;

  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
}
