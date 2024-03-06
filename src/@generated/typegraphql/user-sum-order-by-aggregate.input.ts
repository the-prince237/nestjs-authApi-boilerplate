import { HideField, InputType } from '@nestjs/graphql';
import { SortOrder } from './sort-order.enum';

@InputType()
export class UserSumOrderByAggregateInput {
  @HideField()
  id?: keyof typeof SortOrder;
}
