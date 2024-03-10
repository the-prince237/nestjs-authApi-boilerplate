import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from 'src/@generated/typegraphql';
import { UserCreateInput } from 'src/@generated/typegraphql/user-create.inputArgs';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-user.dto';
import { AuthResponse } from './entities/auth-response.entity';

@Resolver(() => AuthResponse)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => AuthResponse)
  async login(@Args() loginDto: LoginDto): Promise<User> {
    try {
      return await this.authService.login(loginDto);
    } catch (loginError) {
      throw loginError;
    }
  }

  @Mutation(() => AuthResponse)
  async register(@Args() data: UserCreateInput) {
    try {
      return await this.authService.register(data);
    } catch (err) {
      throw err;
    }
  }
}
