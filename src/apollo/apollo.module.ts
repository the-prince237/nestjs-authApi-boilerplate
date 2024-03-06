import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { json } from 'body-parser';
import { resolvers } from 'graphql-scalars';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma.module';
import { UsersResolver } from './users/users.resolver';
import { UsersService } from './users/users.service';

@Module({
  providers: [PrismaService, UsersService, UsersResolver],
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
    AuthModule,
  ],
})
export class ApolloModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(json()).forRoutes('graphql');
  }
}
