import { Field, ObjectType } from '@nestjs/graphql';

export
@ObjectType()
class RegisterResponse {
  @Field({ nullable: false })
  token: string;
}
