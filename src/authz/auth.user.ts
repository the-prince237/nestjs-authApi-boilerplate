// import Long from 'long';
import { AuthorizableUser } from 'nest-casl';
import { Roles } from './app.roles';

export class User implements AuthorizableUser<Roles, string> {
  id: string;
  gid: string;
  urlSlug: string;
  firstName: string;
  lastName: string;
  password: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  roles: Roles[];
}
