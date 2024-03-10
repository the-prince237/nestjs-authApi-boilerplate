import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { UserAvgAggregateInput } from './user-avg-aggregate.input';
import { UserCountAggregateInput } from './user-count-aggregate.input';
import { UserMaxAggregateInput } from './user-max-aggregate.input';
import { UserMinAggregateInput } from './user-min-aggregate.input';
import { UserOrderByWithRelationAndSearchRelevanceInput } from './user-order-by-with-relation-and-search-relevance.input';
import { UserSumAggregateInput } from './user-sum-aggregate.input';
import { UserWhereUniqueInput } from './user-where-unique.input';
import { UserWhereInput } from './user-where.input';

@ArgsType()
export class UserAggregateArgs {
  @Field(() => UserWhereInput, { nullable: true })
  @Type(() => UserWhereInput)
  where?: UserWhereInput;

  @Field(() => [UserOrderByWithRelationAndSearchRelevanceInput], {
    nullable: true,
  })
  orderBy?: Array<UserOrderByWithRelationAndSearchRelevanceInput>;

  @Field(() => UserWhereUniqueInput, { nullable: true })
  cursor?: Prisma.AtLeast<
    UserWhereUniqueInput,
    'id' | 'gid' | 'urlSlug' | 'username' | 'email'
  >;

  @Field(() => Int, { nullable: true })
  take?: number;

  @Field(() => Int, { nullable: true })
  skip?: number;

  @Field(() => UserCountAggregateInput, { nullable: true })
  _count?: UserCountAggregateInput;

  @Field(() => UserAvgAggregateInput, { nullable: true })
  _avg?: UserAvgAggregateInput;

  @Field(() => UserSumAggregateInput, { nullable: true })
  _sum?: UserSumAggregateInput;

  @Field(() => UserMinAggregateInput, { nullable: true })
  _min?: UserMinAggregateInput;

  @Field(() => UserMaxAggregateInput, { nullable: true })
  _max?: UserMaxAggregateInput;
}
