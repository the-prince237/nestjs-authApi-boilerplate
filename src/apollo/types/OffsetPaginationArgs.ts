import { ArgsType, Field, Int } from '@nestjs/graphql';
import { SortOrder } from 'src/@generated/typegraphql';

@ArgsType()
export class OffsetPaginationArgs {
  @Field(() => Int, { nullable: true })
  perPage?: number;

  @Field(() => Int, { nullable: true })
  page?: number;

  @Field({ nullable: true })
  sortField?: string;

  @Field(() => SortOrder, { nullable: true })
  sortOrder?: SortOrder;
}
