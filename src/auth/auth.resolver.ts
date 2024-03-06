import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User, UserCreateInput } from 'src/@generated/typegraphql';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-user.dto';
import { RegisterResponse } from './entities/registerResponse.entity';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => User)
  async login(@Args('loginDto') loginDto: LoginDto): Promise<User> {
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
