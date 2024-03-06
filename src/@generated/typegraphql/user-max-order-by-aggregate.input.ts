import { Field, HideField, InputType } from '@nestjs/graphql';
import { SortOrder } from './sort-order.enum';

@InputType()
export class UserMaxOrderByAggregateInput {
  @HideField()
  id?: keyof typeof SortOrder;

  @HideField()
  gid?: keyof typeof SortOrder;

  @HideField()
  urlSlug?: keyof typeof SortOrder;

  @Field(() => SortOrder, { nullable: true })
  firstName?: keyof typeof SortOrder;

  @Field(() => SortOrder, { nullable: true })
  lastName?: keyof typeof SortOrder;

  @Field(() => SortOrder, { nullable: true })
  password?: keyof typeof SortOrder;

  @Field(() => SortOrder, { nullable: true })
  username?: keyof typeof SortOrder;

  @Field(() => SortOrder, { nullable: true })
  email?: keyof typeof SortOrder;

  @Field(() => SortOrder, { nullable: true })
  createdAt?: keyof typeof SortOrder;

  @Field(() => SortOrder, { nullable: true })
  updatedAt?: keyof typeof SortOrder;
}
