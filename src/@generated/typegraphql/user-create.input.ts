import { Field, HideField, InputType } from '@nestjs/graphql';

@InputType()
export class UserCreateInput {
  @HideField()
  id?: bigint | number;

  @HideField()
  gid!: string;

  @HideField()
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

  @HideField()
  createdAt?: Date | string;

  @HideField()
  updatedAt?: Date | string;
}
