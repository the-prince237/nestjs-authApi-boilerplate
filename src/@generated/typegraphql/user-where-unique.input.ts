import { Field, HideField, InputType } from '@nestjs/graphql';
import { DateTimeFilter } from './date-time-filter.input';
import { StringFilter } from './string-filter.input';
import { UserWhereInput } from './user-where.input';

@InputType()
export class UserWhereUniqueInput {
  @HideField()
  id?: bigint | number;

  @HideField()
  gid?: string;

  @HideField()
  urlSlug?: string;

  @Field(() => String, { nullable: true })
  username?: string;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => [UserWhereInput], { nullable: true })
  AND?: Array<UserWhereInput>;

  @Field(() => [UserWhereInput], { nullable: true })
  OR?: Array<UserWhereInput>;

  @Field(() => [UserWhereInput], { nullable: true })
  NOT?: Array<UserWhereInput>;

  @Field(() => StringFilter, { nullable: true })
  firstName?: StringFilter;

  @Field(() => StringFilter, { nullable: true })
  lastName?: StringFilter;

  @Field(() => StringFilter, { nullable: true })
  password?: StringFilter;

  @Field(() => DateTimeFilter, { nullable: true })
  createdAt?: DateTimeFilter;

  @Field(() => DateTimeFilter, { nullable: true })
  updatedAt?: DateTimeFilter;
}
