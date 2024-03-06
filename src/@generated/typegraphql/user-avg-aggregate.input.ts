import { HideField, InputType } from '@nestjs/graphql';

@InputType()
export class UserAvgAggregateInput {
  @HideField()
  id?: true;
}
