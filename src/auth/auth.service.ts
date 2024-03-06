import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserCreateInput } from 'src/@generated/typegraphql';
import { PrismaService } from 'src/prisma.module';
import { UsersService } from '../apollo/users/users.service';
import { LoginDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
    private readonly UserService: UsersService,
  ) {}

  async login(loginDto: LoginDto): Promise<any> {
    const { username, password } = loginDto;

    const user = await this.prisma.user.findUniqueOrThrow({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      throw new BadRequestException('Invalid password');
    }

    return {
      token: this.jwtService.sign({ username }),
    };
  }

  async register(registerArgs: UserCreateInput): Promise<any> {
    const encryptedPassword = await bcrypt.hash(registerArgs.password, 10);
    const registerPayload = { ...registerArgs, password: encryptedPassword };
    const user = await this.UserService.createUser(registerPayload);

    return {
      token: this.jwtService.sign({ username: user.username }),
    };
  }
}
