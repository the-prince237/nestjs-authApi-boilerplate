import { registerEnumType } from '@nestjs/graphql';

export enum UserScalarFieldEnum {
  id = 'id',
  gid = 'gid',
  urlSlug = 'urlSlug',
  firstName = 'firstName',
  lastName = 'lastName',
  password = 'password',
  username = 'username',
  email = 'email',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
}

registerEnumType(UserScalarFieldEnum, {
  name: 'UserScalarFieldEnum',
  description: undefined,
});
