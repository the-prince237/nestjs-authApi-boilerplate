import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-user.dto';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RegisterResponse } from './entities/registerResponse.entity';
import { User, UserCreateInput } from 'src/@generated/typegraphql';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => User)
  async login(@Args() loginDto: LoginDto): Promise<User> {
    try {
      return await this.authService.login(loginDto);
    } catch (loginError) {
      throw loginError;
    }
  }

  @Mutation(() => RegisterResponse)
  async register(
    @Args('registerArgs') registerArgs: UserCreateInput,
  ): Promise<RegisterResponse> {
    try {
      return await this.authService.register(registerArgs);
    } catch (err) {
      throw err;
    }
  }
}
