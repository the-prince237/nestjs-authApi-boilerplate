import { Field, Int, ArgsType } from '@nestjs/graphql';
import { SortOrder } from 'src/@generated/typegraphql';
import { UserAdminFilter } from './user.admin.filter';
@ArgsType()
export class UserAdminArgs {
  @Field(() => Int, { nullable: true })
  page: number;
  @Field(() => Int, { nullable: true })
  perPage: number;
  @Field({ nullable: true })
  sortField: string;
  @Field({ nullable: true })
  sortOrder: SortOrder;
  @Field(() => UserAdminFilter, { nullable: true })
  filter: UserAdminFilter;
}
