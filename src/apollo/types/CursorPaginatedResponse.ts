import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ClassType } from 'type-graphql';

@ObjectType()
class PageInfo {
  @Field({ nullable: true })
  hasNextPage?: boolean;
  @Field({ nullable: true })
  hasPreviousPage?: boolean;
  @Field({ nullable: true })
  startCursor?: string;
  @Field({ nullable: true })
  endCursor?: string;
}

export default function CursorPaginatedResponse<TItem extends object>(
  TItemClass: ClassType<TItem>,
) {
  @ObjectType(`${TItemClass.name}Edge`)
  class EdgeClass {
    cursor: string;

    @Field(() => TItemClass)
    node: TItem;
  }
  @ObjectType(`${TItemClass.name}Connection`)
  class ConnectionClass {
    @Field(() => [TItemClass], { nullable: 'itemsAndList' })
    nodes: TItem[];

    @Field(() => Int, { nullable: true })
    totalCount: number;

    @Field(() => PageInfo, { nullable: true })
    pageInfo: PageInfo;

    @Field(() => [EdgeClass], { nullable: 'itemsAndList' })
    edges: EdgeClass[];
  }
  return ConnectionClass;
}
