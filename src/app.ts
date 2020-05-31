import { ApolloServer, ApolloError } from 'apollo-server';
import { GraphQLError } from 'graphql';

import OpenTriviaAPI from './graphql/datasources/open-trivia-api';
import dataSources from './graphql/datasources';
import resolvers from './graphql/resolvers';
import typeDefs from './graphql/typeDefs';
import env from './config/environment';

const server = new ApolloServer({
  dataSources: () => ({
    ...dataSources,
    openTrivia: new OpenTriviaAPI(),
  }),
  resolvers,
  typeDefs,
  formatError: (error: GraphQLError): Error => {
    if (error.originalError instanceof ApolloError) {
      return error;
    }

    console.error(error);

    return new GraphQLError(error.message);
  },
});

server
  .listen(env.PORT)
  .then(({ url }) => console.log(`UHUL! Cine-Tasty-API is running at ${url}!`));
