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
import { User } from '../users/entities/user.entity';
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

    const user = await this.prisma.user.findUnique({
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
      user,
    };
  }

  async register(registerArgs: UserCreateInput): Promise<User> {
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

    return await this.UserService.createUser(registerPayload);
  }
}
