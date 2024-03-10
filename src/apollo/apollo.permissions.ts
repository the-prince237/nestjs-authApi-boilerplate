import { InferSubjects } from '@casl/ability';
import { Actions, Permissions } from 'nest-casl';
import { Roles } from '../authz/app.roles';
import { User } from '../authz/auth.user';

export type Subjects = InferSubjects<typeof User> | 'all';

export const permissions: Permissions<Roles, Subjects, Actions, User> = {};
