import { createTestClient } from 'apollo-server-testing';
import { ApolloServer, gql } from 'apollo-server';

const mockRestDataSourceGet = jest.fn();

import { SearchType } from '../../../../../lib/types';
import { rawPeopleItem, peopleItem } from '../../../../../__tests__/mocks/people.stub';
import { movieGenres, tvGenres } from '../../../../../../__tests__/mocks/mediaGenres';
import resolvers from '../../../../resolvers';
import typeDefs from '../../../../typeDefs';
import TheMovieDBAPI from '../..';

const SEARCH_PERSON = gql`
  query SearchPerson($input: SearchInput!) {
    search(input: $input) {
      total_results
      hasMore
      items {
        ... on BasePerson {
          profile_path
          adult
          id
          popularity
          name
          known_for {
            ... on BaseMovie {
              original_title
              video
              title
              adult
              release_date
              backdrop_path
              genre_ids
              overview
              vote_average
              media_type
              poster_path
              popularity
              original_language
              vote_count
              id
            }

            ... on BaseTVShow {
              origin_country
              original_name
              name
              first_air_date
              backdrop_path
              genre_ids
              overview
              vote_average
              media_type
              poster_path
              popularity
              original_language
              vote_count
              id
            }
          }
        }
      }
    }
  }
`;

jest.mock('apollo-datasource-rest', () => {
  class MockRESTDataSource {
    baseUrl = '';
    get = mockRestDataSourceGet;
  }

  return {
    RESTDataSource: MockRESTDataSource,
    HTTPCache: class HTTPCache {},
  };
});

const makeTestServer = (): ApolloServer => {
  const tmdbAPI = new TheMovieDBAPI();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
      tmdb: tmdbAPI,
    }),
  });

  return server;
};

describe('Integration - DataSources-Search.Person]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Query - Search for a Person', () => {
    it('should search for person with the name that matches with the query provided on TheMoviewDB API and returns the result correctly', async () => {
      mockRestDataSourceGet
        .mockReturnValueOnce({
          total_results: 1,
          results: [rawPeopleItem],
          total_pages: 1,
        })
        .mockReturnValueOnce({ genres: movieGenres })
        .mockReturnValueOnce({ genres: tvGenres });

      const server = makeTestServer();

      const { query } = createTestClient(server);

      const { data } = await query({
        query: SEARCH_PERSON,
        variables: { input: { page: 1, query: 'any', type: SearchType.Person } },
      });

      expect(data!.search.hasMore).toEqual(false);
      expect(data!.search.total_results).toEqual(1);
      expect(data!.search.items).toEqual([peopleItem]);
    });

    it('should throw an error when the query is empty', async () => {
      const server = makeTestServer();

      const { query } = createTestClient(server);

      const { errors } = await query({
        query: SEARCH_PERSON,
        variables: { input: { page: 1, query: '', type: SearchType.Person } },
      });

      return expect(errors && errors[0].message).toEqual('Search query cannot be empty.');
    });
  });
});
