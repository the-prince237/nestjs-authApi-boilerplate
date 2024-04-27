import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from 'src/@generated/typegraphql';
import { UserCreateInput } from 'src/@generated/typegraphql/user-create.inputArgs';
import { extractTokenFromHeader } from './auth.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-user.dto';
import {
  AuthResponse,
  SignOutResponse,
  UserLoggedInResponse,
} from './entities/auth-response.entity';

@Resolver(() => AuthResponse)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async login(@Args() loginDto: LoginDto): Promise<User> {
    try {
      return await this.authService.login(loginDto);
    } catch (loginError) {
      throw loginError;
    }
  }

  @Query(() => UserLoggedInResponse)
  userIsLoggedIn(@Context('req') request: any): UserLoggedInResponse {
    const token = extractTokenFromHeader(request);
    return { loggedIn: !!token };
  }

  @Mutation(() => SignOutResponse)
  async signOut(@Context() context): Promise<SignOutResponse> {
    const request = context.req;
    request.session = null;
    return { success: true };
  }

  @Mutation(() => User)
  async register(@Args() data: UserCreateInput) {
    try {
      return await this.authService.register(data);
    } catch (err) {
      throw err;
    }
  }
}
