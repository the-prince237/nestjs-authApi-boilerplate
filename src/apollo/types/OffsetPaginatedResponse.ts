import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ClassType } from 'type-graphql';

@ObjectType()
class OffsetPageInfo {
  @Field(() => Int, { nullable: true })
  total?: number;

  @Field(() => Int, { nullable: true })
  lastPage?: number;

  @Field(() => Int, { nullable: true })
  currentPage?: number;

  @Field(() => Int, { nullable: true })
  perPage?: number;

  @Field(() => Int, { nullable: true })
  prev?: number | null;

  @Field(() => Int, { nullable: true })
  next?: number | null;
}

export default function OffsetPaginatedResponse<TItem>(
  TItemClass: ClassType<TItem>,
) {
  @ObjectType(`${TItemClass.name}OffsetPaginationResponse`)
  class ConnectionClass {
    @Field(() => [TItemClass], { nullable: 'itemsAndList' })
    data: TItem[];

    @Field(() => OffsetPageInfo, { nullable: true })
    meta: OffsetPageInfo;
  }
  return ConnectionClass;
}
