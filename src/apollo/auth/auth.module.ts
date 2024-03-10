import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaService } from 'nestjs-prisma';
import { UsersResolver } from 'src/apollo/users/users.resolver';
import { UsersService } from 'src/apollo/users/users.service';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: 'w3PDlfr0H2za8TU0',
      }),
    }),
  ],
  exports: [JwtModule],
  providers: [
    AuthService,
    AuthResolver,
    JwtService,
    PrismaService,
    UsersService,
    UsersResolver,
  ],
})
export class AuthModule {}
