import { Field, HideField, InputType } from '@nestjs/graphql';

@InputType()
export class UserUncheckedUpdateManyInput {
  @HideField()
  id?: bigint | number;

  @HideField()
  gid?: string;

  @HideField()
  urlSlug?: string;

  @Field(() => String, { nullable: true })
  firstName?: string;

  @Field(() => String, { nullable: true })
  lastName?: string;

  @Field(() => String, { nullable: true })
  password?: string;

  @Field(() => String, { nullable: true })
  username?: string;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => Date, { nullable: true })
  createdAt?: Date | string;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date | string;
}
