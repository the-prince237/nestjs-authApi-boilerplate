import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { UserCreateInput, UserUpdateInput } from 'src/@generated/typegraphql';
import { SlugOrUid } from '../types/ProductQueryArgs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAllUser() {
    return await this.prisma.user.findMany();
  }

  async update(args: { username: string }, data: UserUpdateInput) {
    try {
      const user = await this.prisma.user.update({ where: args, data });
      return user;
    } catch (e) {
      throw e;
    }
  }

  async findUser(args: SlugOrUid) {
    return await this.prisma.user.findUnique({ where: { ...args } });
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async createUser(data: UserCreateInput) {
    const { username } = data;
    const existing = await this.prisma.user.findFirst({
      where: { username },
    });

    if (!existing) {
      return await this.prisma.user.create({ data });
    }

    throw new ConflictException('User already exist');
  }

  async getAllUsingOffsetPagination(args) {
    const { perPage, sortField, sortOrder, filter } = args;

    const queryArgs = {
      where: filter,
      orderBy: {
        [sortField]: sortOrder.toLowerCase(),
      },
      take: perPage,
    };

    return await this.prisma.user.findMany(queryArgs);
  }

  getAllCount(args) {
    return this.prisma.user.count({
      where: args.filter,
    });
  }

  async getLoggedInUser(username: string) {
    try {
      return await this.prisma.user.findUnique({ where: { username } });
    } catch (e) {
      throw e;
    }
  }

  remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
