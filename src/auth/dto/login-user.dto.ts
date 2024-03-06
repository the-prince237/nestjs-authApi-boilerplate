import { Field, InputType } from '@nestjs/graphql';
import { Length } from 'class-validator';

@InputType()
export class LoginDto {
  @Field(() => String, { nullable: false })
  @Length(0, 100)
  username: string;

  @Field(() => String, { nullable: false })
  @Length(0, 100)
  password: string;
}
