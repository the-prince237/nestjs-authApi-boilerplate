import { HideField, InputType } from '@nestjs/graphql';
import { SortOrder } from './sort-order.enum';

@InputType()
export class UserAvgOrderByAggregateInput {
  @HideField()
  id?: keyof typeof SortOrder;
}
