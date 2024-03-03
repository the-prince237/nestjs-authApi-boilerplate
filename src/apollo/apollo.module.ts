import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthResolver } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { resolvers } from 'graphql-scalars';
import { json } from 'body-parser';
import { PrismaService } from 'src/prisma.module';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users/users.service';
import { UsersResolver } from './users/users.resolver';

@Module({
  providers: [
    AuthService,
    PrismaService,
    UsersService,
    JwtService,
    AuthResolver,
    UsersResolver,
  ],
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/schema.gql',
      sortSchema: true,
      introspection: true,
      resolvers,
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
  ],
})
export class ApolloModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(json()).forRoutes('graphql');
  }
}
