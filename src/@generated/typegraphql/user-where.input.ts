import { Field, HideField, InputType } from '@nestjs/graphql';
import { DateTimeFilter } from './date-time-filter.input';
import { IntFilter } from './int-filter.input';
import { StringFilter } from './string-filter.input';

@InputType()
export class UserWhereInput {
  @Field(() => [UserWhereInput], { nullable: true })
  AND?: Array<UserWhereInput>;

  @Field(() => [UserWhereInput], { nullable: true })
  OR?: Array<UserWhereInput>;

  @Field(() => [UserWhereInput], { nullable: true })
  NOT?: Array<UserWhereInput>;

  @HideField()
  id?: IntFilter;

  @HideField()
  gid?: StringFilter;

  @HideField()
  urlSlug?: StringFilter;

  @Field(() => StringFilter, { nullable: true })
  firstName?: StringFilter;

  @Field(() => StringFilter, { nullable: true })
  lastName?: StringFilter;

  @Field(() => StringFilter, { nullable: true })
  password?: StringFilter;

  @Field(() => StringFilter, { nullable: true })
  username?: StringFilter;

  @Field(() => StringFilter, { nullable: true })
  email?: StringFilter;

  @HideField()
  createdAt?: DateTimeFilter;

  @HideField()
  updatedAt?: DateTimeFilter;
}
