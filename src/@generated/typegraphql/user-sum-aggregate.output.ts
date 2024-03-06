import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLBigInt } from 'graphql-scalars';

@ObjectType()
export class UserSumAggregate {
  @Field(() => GraphQLBigInt, { nullable: true })
  id?: bigint | number;
}
