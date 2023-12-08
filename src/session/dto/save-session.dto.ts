import { Session } from '../entities/session.entity';

export type SaveSession = Omit<Session, 'id' | 'valid'>;
