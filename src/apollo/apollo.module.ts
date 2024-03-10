import { HttpModule } from '@nestjs/axios';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { json } from 'body-parser';
import { graphqlUploadExpress } from 'graphql-upload';
import { CaslModule } from 'nest-casl';
import { PrismaService } from 'nestjs-prisma';
import { ConfigModule } from 'src/config/config.module';
import { permissions } from './apollo.permissions';
import { AuthResolver } from './auth/auth.resolver';
import { AuthService } from './auth/auth.service';
import { UsersAdminCrud } from './users/@generated/users.admin.resolver';
import { UsersResolver } from './users/users.resolver';
import { UsersService } from './users/users.service';

@Module({
  providers: [
    UsersService,
    UsersResolver,
    UsersAdminCrud,
    AuthService,
    AuthResolver,
    JwtService,
    PrismaService,
  ],
  imports: [
    CaslModule.forFeature({ permissions }),
    HttpModule,
    ConfigModule,
    JwtModule.registerAsync({
      useFactory: async () => ({ secret: 'w3PDlfr0H2za8TU0' }),
    }),
  ],
})
export class ApolloModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(json(), graphqlUploadExpress()).forRoutes('graphql');
  }
}
