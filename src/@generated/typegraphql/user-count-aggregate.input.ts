import { Field, HideField, InputType } from '@nestjs/graphql';

@InputType()
export class UserCountAggregateInput {
  @HideField()
  id?: true;

  @HideField()
  gid?: true;

  @HideField()
  urlSlug?: true;

  @Field(() => Boolean, { nullable: true })
  firstName?: true;

  @Field(() => Boolean, { nullable: true })
  lastName?: true;

  @Field(() => Boolean, { nullable: true })
  password?: true;

  @Field(() => Boolean, { nullable: true })
  username?: true;

  @Field(() => Boolean, { nullable: true })
  email?: true;

  @HideField()
  createdAt?: true;

  @HideField()
  updatedAt?: true;

  @Field(() => Boolean, { nullable: true })
  _all?: true;
}
