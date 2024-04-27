import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';
import { User } from 'src/@generated/typegraphql';
import { JwtAuthGuard } from '../auth/auth.guard';
import { UpdatePasswordArgs } from './dto/user.udpatePasswordArgs';
import { SuccessResponse } from './entities/successResponse.entity';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User])
  async getAllUser(): Promise<User[]> {
    try {
      return await this.usersService.getAllUser();
    } catch (error) {
      throw new Error('An error occured !');
    }
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async me(@Context('req') request: any) {
    const username = request?.user?.username;
    return this.usersService.getLoggedInUser(username);
  }

  @Mutation(() => SuccessResponse)
  @UseGuards(JwtAuthGuard)
  async updatePassword(
    @Context('req') request: any,
    @Args() updatePasswordArgs: UpdatePasswordArgs,
  ): Promise<SuccessResponse> {
    try {
      const { password, newPassword } = updatePasswordArgs;
      const username = request?.user?.username;
      const user = await this.usersService.getLoggedInUser(username);

      const validPassword = await bcrypt.compare(password, user.password);

      if (validPassword) {
        const encryptedPassword = await bcrypt.hash(newPassword, 10);
        await this.usersService.update(
          {
            username,
          },
          { password: encryptedPassword },
        );

        console.log({ success: true });

        return { success: true };
      }
      throw new BadRequestException('Wrong password !');
    } catch (e) {
      throw e;
    }
  }
}
