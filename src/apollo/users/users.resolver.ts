import { Query, Resolver } from '@nestjs/graphql';
import { User } from 'src/@generated/typegraphql';
import { UsersService } from './users.service';

@Resolver('User')
export class UsersResolver {
  constructor(private readonly Userervice: UsersService) {}

  @Query(() => Array<User>)
  async getAllUser(): Promise<User[]> {
    try {
      return await this.Userervice.getAllUser();
    } catch (error) {
      throw new Error('An error occured !');
    }
  }
}
