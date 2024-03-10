import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserAvgAggregate } from './user-avg-aggregate.output';
import { UserCountAggregate } from './user-count-aggregate.output';
import { UserMaxAggregate } from './user-max-aggregate.output';
import { UserMinAggregate } from './user-min-aggregate.output';
import { UserSumAggregate } from './user-sum-aggregate.output';

@ObjectType()
export class UserGroupBy {
  @Field(() => Int, { nullable: false })
  id!: number;

  @Field(() => String, { nullable: false })
  gid!: string;

  @Field(() => String, { nullable: false })
  urlSlug!: string;

  @Field(() => String, { nullable: false })
  firstName!: string;

  @Field(() => String, { nullable: false })
  lastName!: string;

  @Field(() => String, { nullable: false })
  password!: string;

  @Field(() => String, { nullable: false })
  username!: string;

  @Field(() => String, { nullable: false })
  email!: string;

  @Field(() => Date, { nullable: false })
  createdAt!: Date | string;

  @Field(() => Date, { nullable: false })
  updatedAt!: Date | string;

  @Field(() => UserCountAggregate, { nullable: true })
  _count?: UserCountAggregate;

  @Field(() => UserAvgAggregate, { nullable: true })
  _avg?: UserAvgAggregate;

  @Field(() => UserSumAggregate, { nullable: true })
  _sum?: UserSumAggregate;

  @Field(() => UserMinAggregate, { nullable: true })
  _min?: UserMinAggregate;

  @Field(() => UserMaxAggregate, { nullable: true })
  _max?: UserMaxAggregate;
}
