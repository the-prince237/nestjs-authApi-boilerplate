import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { CaslModule } from 'nest-casl';
import { PrismaModule } from 'nestjs-prisma';
import { ApolloModule } from './apollo/apollo.module';
import { AuthModule } from './apollo/auth/auth.module';
import { Roles } from './authz/app.roles';
import { User } from './authz/auth.user';
import { HttpErrorFilter } from './common/http-error.filter';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [
    ApolloModule,
    PrismaModule.forRoot({ isGlobal: true }),
    CaslModule.forRoot<Roles, User>({
      superuserRole: Roles.superadmin,
    }),
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/schema.gql',
      sortSchema: true,
      introspection: true,
      csrfPrevention: false,
      status400ForVariableCoercionErrors: true,
      formatError: (formattedError, error) => {
        console.log('formattedError', formattedError);
        console.log('error', error);
        return formattedError;
      },
      playground: true,
      fieldResolverEnhancers: ['guards'],
      context: ({ req, res }) => ({ req, res }),
    }),
    AuthModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply().forRoutes('*');
  }
}
