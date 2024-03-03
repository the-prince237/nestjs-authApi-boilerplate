import { ArgsType, Field } from '@nestjs/graphql';
import * as GraphQLScalars from 'graphql-scalars';
import type { XOR } from 'ts-xor';

@ArgsType()
export class ProductQueryArgs {
  @Field(() => GraphQLScalars.BigIntResolver, {
    nullable: true,
  })
  id?: bigint;

  @Field({ nullable: true })
  urlSlug?: string;

  @Field({ nullable: true })
  gid?: string;
}

interface Slug {
  urlSlug: string;
}

interface Gid {
  gid: string;
}

interface Id {
  id: bigint;
}

interface Email {
  email: string;
}

interface Username {
  username: string;
}

export type SlugOrUid = XOR<Slug, Id, Gid, Email, Username>;
