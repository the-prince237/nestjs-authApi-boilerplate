import { GraphQLScalarType } from 'graphql';
import { GraphQLDateTimeAlias } from './DateTime';

export { GraphQLDateTimeAlias };

export const resolvers: Record<string, GraphQLScalarType> = {
  DateTimeAlias: GraphQLDateTimeAlias,
};
