import { ConflictException, Injectable } from '@nestjs/common';
import { UserCreateInput } from 'src/@generated/typegraphql';
import { PrismaService } from 'src/prisma.module';
import { SlugOrUid } from '../types/ProductQueryArgs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async getAllUser() {
    return await this.prisma.user.findMany();
  }

  async findUser(args: SlugOrUid) {
    return await this.prisma.user.findUnique({ where: { ...args } });
  }

  async findOne(id: number | bigint) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async createUser(data: UserCreateInput) {
    const { username } = data;
    const existing = await this.prisma.user.findFirst({
      where: { username },
    });

    if (existing) {
      throw new ConflictException('User already exist');
    }

    return this.prisma.user.create({ data });
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

  remove(id: bigint | number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
