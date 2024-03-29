import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UserAdminFilter {
  @Field(() => Int, { nullable: true })
  id: number;
  @Field({ nullable: true })
  q: string;
}
