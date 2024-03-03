import { Field, InputType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';

@InputType()
export class RegisterDto {
  @Field(() => String)
  @IsString()
  @Length(0, 100)
  username: string;

  @Field(() => String)
  @IsString()
  @Length(0, 100)
  email: string;

  @Field(() => String)
  @IsString()
  @Length(0, 100)
  firstName: string;

  @Field(() => String)
  @IsString()
  @Length(0, 100)
  lastName: string;

  @Field(() => String)
  @IsString()
  @Length(0, 100)
  password: string;
}
