import { Account } from '../entities/account.entity';

export type SaveAccount = Omit<Account, 'id' | 'sessions' | 'verified'>;
