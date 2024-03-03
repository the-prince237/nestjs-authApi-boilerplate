import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { JwtAuthGuard } from '../../auth/auth.guard';

import { User } from '../entities/user.entity';
import { UsersService } from '../users.service';
import { UsersHook } from './users.hook';
import { ListMetadata } from '../../types/ListMetadata';
import { UserAdminArgs } from './dto/user.admin.args';

@Resolver(() => User)
export class UsersAdminCrud {
  constructor(private readonly usersService: UsersService) {}
  @Query(() => User)
  async User(@Args('id', { type: () => Int }) id: number): Promise<User> {
    return await this.usersService.findOne(id);
  }

  @Query(() => [User], { nullable: 'itemsAndList' })
  async allUsers(@Args() args: UserAdminArgs): Promise<User[]> {
    return await this.usersService.getAllUsingOffsetPagination(args);
  }

  @Query(() => ListMetadata, { nullable: true })
  async _allUsersMeta(@Args() args: UserAdminArgs): Promise<{ count: number }> {
    const count = await this.usersService.getAllCount(args);
    return { count };
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard, AccessGuard)
  @UseAbility(Actions.delete, User, UsersHook)
  async deleteUser(@Args('id', { type: () => Int }) id: number): Promise<User> {
    return this.usersService.remove(id);
  }
}
