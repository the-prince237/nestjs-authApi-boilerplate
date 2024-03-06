import { Module } from '@nestjs/common';
import { ApolloModule } from './apollo/apollo.module';
import PrismaModule from './prisma.module';

@Module({
  imports: [ApolloModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
