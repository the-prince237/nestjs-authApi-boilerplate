import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UserFirstNameLastNameCompoundUniqueInput {
  @Field(() => String, { nullable: false })
  firstName!: string;

  @Field(() => String, { nullable: false })
  lastName!: string;
}
