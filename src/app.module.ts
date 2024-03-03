import { Module } from '@nestjs/common';
import { ApolloModule } from './apollo/apollo.module';

@Module({
  imports: [ApolloModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
