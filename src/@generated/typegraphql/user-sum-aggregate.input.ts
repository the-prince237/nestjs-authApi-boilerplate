import { HideField, InputType } from '@nestjs/graphql';

@InputType()
export class UserSumAggregateInput {
  @HideField()
  id?: true;
}
