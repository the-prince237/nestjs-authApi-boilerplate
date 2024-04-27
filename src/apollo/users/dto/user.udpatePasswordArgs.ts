import { ArgsType, Field, InputType } from '@nestjs/graphql';

@ArgsType()
@InputType()
export class UpdatePasswordArgs {
  @Field({ nullable: false })
  password: string;
  @Field({ nullable: false })
  newPassword: string;
}
