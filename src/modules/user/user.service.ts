import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Account } from '../account/entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly entityManager: EntityManager,
  ) {}

  async createUser(account: Account, createUser: CreateUserDto): Promise<User> {
    const user = {
      ...createUser,
      account,
    };
    const newUser = new User(user);
    await this.entityManager.save(newUser);

    return newUser;
  }

  async getUser(userId: number): Promise<User> {
    const user = await this.userRepository.findOneBy({
      account: { id: userId },
    });
    return user;
  }
}
