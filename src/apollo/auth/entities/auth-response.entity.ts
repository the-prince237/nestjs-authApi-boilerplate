import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/@generated/typegraphql';

@ObjectType()
export class AuthResponse {
  @Field({ nullable: false })
  token: string;
  @Field({ nullable: false })
  user: User;
}

@ObjectType()
export class UserLoggedInResponse {
  @Field({ nullable: false })
  loggedIn: boolean;
}

@ObjectType()
export class EmailResponse {
  @Field({ nullable: false })
  email: string;
}

@ObjectType()
export class SignOutResponse {
  @Field()
  success: boolean;
}
