import { Injectable } from '@nestjs/common';
import { Request, SubjectBeforeFilterHook } from 'nest-casl';
import { UsersService } from '../users.service';
import { User } from '../entities/user.entity';
import { SlugOrUid } from '../../types/ProductQueryArgs';
@Injectable()
export class UsersHook implements SubjectBeforeFilterHook<User, Request> {
  constructor(private readonly usersService: UsersService) {}
  async run({ params }: Request): Promise<User> {
    let args: SlugOrUid;
    if ('id' in params) {
      args = { id: params.id };
    } else if ('gid' in params) {
      args = { gid: params.gid };
    } else if ('urlSlug' in params) {
      args = { urlSlug: params.urlSlug };
    }

    return await this.usersService.findUser(args);
  }
}
