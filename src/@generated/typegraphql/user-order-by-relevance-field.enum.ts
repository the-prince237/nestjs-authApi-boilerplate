import { registerEnumType } from '@nestjs/graphql';

export enum UserOrderByRelevanceFieldEnum {
  gid = 'gid',
  urlSlug = 'urlSlug',
  firstName = 'firstName',
  lastName = 'lastName',
  password = 'password',
  username = 'username',
  email = 'email',
}

registerEnumType(UserOrderByRelevanceFieldEnum, {
  name: 'UserOrderByRelevanceFieldEnum',
  description: undefined,
});
