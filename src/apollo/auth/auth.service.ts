import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import slug from 'elegant-slug';
import { PrismaService } from 'nestjs-prisma';
import { UserCreateInput } from 'src/@generated/typegraphql/user-create.inputArgs';
import { ConfigService } from 'src/config/config.service';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from '../users/users.service';
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
      token: this.jwtService.sign(
        { username },
        { secret: ConfigService.config.jwtSecretKey },
      ),
    };
  }

  async register(registerArgs: UserCreateInput): Promise<any> {
    const encryptedPassword = await bcrypt.hash(registerArgs.password, 10);

    const registerPayload: UserCreateInput = {
      ...registerArgs,
      urlSlug: slug(registerArgs.firstName, {
        unique: true,
        letterCase: 'lowercase',
      }),
      password: encryptedPassword,
      gid: uuidv4(),
    };

    const user = await this.UserService.createUser(registerPayload);

    console.log({ user });

    return {
      token: this.jwtService.sign(
        { username: user.username },
        { secret: ConfigService.config.jwtSecretKey },
      ),
    };
  }
}
