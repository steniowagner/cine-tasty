const mockRestDataSourceGet = jest.fn();

import { createTestClient } from 'apollo-server-testing';
import { ApolloServer, gql } from 'apollo-server';

import {
  rawTVShow,
  tvshow,
  rawTVShowDetail,
  tvShowDetail,
} from '../../../../../__tests__/mocks/tvshows.stub';
import MEDIA_GENRES_CONSTANTS from '../../handlers/media-genres/utils/constants';
import { getImagesResult, images } from '../../../../../__tests__/mocks/images.stub';
import { tvGenres } from '../../../../../../__tests__/mocks/mediaGenres';
import { Iso6391Language } from '../../../../../lib/types';
import { TrendingTVShowsEndpoints } from '../../../../../@types';
import env from '../../../../../config/environment';
import resolvers from '../../../../resolvers';
import CONSTANTS from '../../utils/constants';
import typeDefs from '../../../../typeDefs';
import TheMovieDBAPI from '../..';

const GET_TRENDING_TV_SHOWS = gql`
  fragment TrendingTVShowItem on BaseTVShow {
    origin_country
    original_name
    name
    first_air_date
    backdrop_path
    genre_ids
    overview
    vote_average
    poster_path
    popularity
    original_language
    vote_count
    id
  }

  query TrendingTVShows($page: Int!) {
    trending_tv_shows {
      on_the_air(args: { page: $page }) {
        total_results
        total_pages
        hasMore
        items {
          ...TrendingTVShowItem
        }
      }
      popular(args: { page: $page }) {
        total_results
        total_pages
        hasMore
        items {
          ...TrendingTVShowItem
        }
      }
      top_rated(args: { page: $page }) {
        total_results
        total_pages
        hasMore
        items {
          ...TrendingTVShowItem
        }
      }
    }
  }
`;

const GET_TV_SHOW_DETAIL = gql`
  query TVShowDetail($id: ID!, $language: ISO6391Language) {
    tv_show(id: $id, language: $language) {
      seasons {
        air_date
        episode_count
        id
        name
        overview
        poster_path
        season_number
      }
      last_episode_to_air {
        air_date
        episode_number
        id
        name
        overview
        production_code
        season_number
        show_id
        still_path
        vote_average
        vote_count
      }
      backdrop_path
      created_by {
        id
        credit_id
        name
        gender
        profile_path
      }
      networks {
        name
        id
        logo_path
        origin_country
      }
      episode_run_time
      first_air_date
      homepage
      id
      in_production
      languages
      last_air_date
      genres
      name
      status
      type
      vote_average
      vote_count
      production_companies {
        id
        logo_path
        name
        origin_country
      }
      original_language
      original_name
      overview
      videos {
        thumbnail {
          extra_small
          small
          medium
          large
          extra_large
        }
        key
        name
        site
        id
        type
      }
      cast {
        name
        profile_path
        id
        character
        gender
        order
      }
      crew {
        department
        id
        job
        name
        gender
        profile_path
      }
      similar {
        origin_country
        original_name
        name
        first_air_date
        backdrop_path
        genre_ids
        overview
        vote_average
        poster_path
        popularity
        original_language
        vote_count
        id
      }
      popularity
      poster_path
      number_of_episodes
      number_of_seasons
      origin_country
      reviews {
        author
        content
        id
        url
      }
    }
  }
`;

const GET_TV_SHOW_IMAGES = gql`
  query TVShowImages($id: ID!) {
    tv_show(id: $id) {
      images(id: $id)
    }
  }
`;

const makeTestServer = (): ApolloServer => {
  return new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
      tmdb: new TheMovieDBAPI(),
    }),
  });
};

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

describe('Integration: DataSources-TVShow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Query - Trending TV Shows', () => {
    it('should query the on-the-air/popular/top_rated tv shows from TheMovieDB API and returns the result correctly', async () => {
      mockRestDataSourceGet
        .mockReturnValueOnce({
          total_pages: 1,
          total_results: 1,
          results: [rawTVShow],
        })
        .mockReturnValueOnce({
          total_pages: 1,
          total_results: 1,
          results: [rawTVShow],
        })
        .mockReturnValueOnce({
          total_pages: 1,
          total_results: 1,
          results: [rawTVShow],
        })
        .mockReturnValueOnce({ genres: tvGenres })
        .mockReturnValueOnce({ genres: tvGenres })
        .mockReturnValueOnce({ genres: tvGenres });

      const server = makeTestServer();

      const { query } = createTestClient(server);

      const { data } = await query({
        query: GET_TRENDING_TV_SHOWS,
        variables: { page: 1 },
      });

      expect(mockRestDataSourceGet.mock.calls.length).toBe(6);

      expect(mockRestDataSourceGet).toHaveBeenCalledWith(
        TrendingTVShowsEndpoints.OnTheAir,
        {
          api_key: env.THE_MOVIE_DB_API_KEY,
          language: 'en-us',
          page: 1,
        },
      );

      expect(mockRestDataSourceGet).toHaveBeenCalledWith(
        TrendingTVShowsEndpoints.Popular,
        {
          api_key: env.THE_MOVIE_DB_API_KEY,
          language: 'en-us',
          page: 1,
        },
      );

      expect(mockRestDataSourceGet).toHaveBeenCalledWith(
        TrendingTVShowsEndpoints.TopRated,
        {
          api_key: env.THE_MOVIE_DB_API_KEY,
          language: 'en-us',
          page: 1,
        },
      );

      expect(mockRestDataSourceGet).toHaveBeenCalledWith(
        MEDIA_GENRES_CONSTANTS.GENRE_TV_SHOW_ENDPOINT,
        {
          api_key: env.THE_MOVIE_DB_API_KEY,
          language: 'en-us',
        },
      );

      expect(mockRestDataSourceGet).toHaveBeenCalledWith(
        MEDIA_GENRES_CONSTANTS.GENRE_TV_SHOW_ENDPOINT,
        {
          api_key: env.THE_MOVIE_DB_API_KEY,
          language: 'en-us',
        },
      );

      expect(mockRestDataSourceGet).toHaveBeenCalledWith(
        MEDIA_GENRES_CONSTANTS.GENRE_TV_SHOW_ENDPOINT,
        {
          api_key: env.THE_MOVIE_DB_API_KEY,
          language: 'en-us',
        },
      );

      expect(data!.trending_tv_shows).toEqual({
        on_the_air: {
          hasMore: false,
          total_pages: 1,
          total_results: 1,
          items: [tvshow],
        },
        top_rated: {
          hasMore: false,
          total_pages: 1,
          total_results: 1,
          items: [tvshow],
        },
        popular: {
          hasMore: false,
          total_pages: 1,
          total_results: 1,
          items: [tvshow],
        },
      });
    });

    it('should query the on-the-air/popular/top_rated tv shows from TheMovieDB API and return the field hasMore as true when has more items to be paginated', async () => {
      mockRestDataSourceGet
        .mockReturnValueOnce({
          total_pages: 2,
          total_results: 2,
          results: [rawTVShow],
        })
        .mockReturnValueOnce({
          total_pages: 2,
          total_results: 2,
          results: [rawTVShow],
        })
        .mockReturnValueOnce({
          total_pages: 2,
          total_results: 2,
          results: [rawTVShow],
        })
        .mockReturnValueOnce({ genres: tvGenres })
        .mockReturnValueOnce({ genres: tvGenres })
        .mockReturnValueOnce({ genres: tvGenres });

      const server = makeTestServer();

      const { query } = createTestClient(server);

      const { data } = await query({
        query: GET_TRENDING_TV_SHOWS,
        variables: { page: 1 },
      });

      expect(mockRestDataSourceGet.mock.calls.length).toBe(6);

      expect(mockRestDataSourceGet).toHaveBeenCalledWith(
        TrendingTVShowsEndpoints.OnTheAir,
        {
          api_key: env.THE_MOVIE_DB_API_KEY,
          language: 'en-us',
          page: 1,
        },
      );

      expect(mockRestDataSourceGet).toHaveBeenCalledWith(
        TrendingTVShowsEndpoints.Popular,
        {
          api_key: env.THE_MOVIE_DB_API_KEY,
          language: 'en-us',
          page: 1,
        },
      );

      expect(mockRestDataSourceGet).toHaveBeenCalledWith(
        TrendingTVShowsEndpoints.TopRated,
        {
          api_key: env.THE_MOVIE_DB_API_KEY,
          language: 'en-us',
          page: 1,
        },
      );

      expect(mockRestDataSourceGet).toHaveBeenCalledWith(
        MEDIA_GENRES_CONSTANTS.GENRE_TV_SHOW_ENDPOINT,
        {
          api_key: env.THE_MOVIE_DB_API_KEY,
          language: 'en-us',
        },
      );

      expect(mockRestDataSourceGet).toHaveBeenCalledWith(
        MEDIA_GENRES_CONSTANTS.GENRE_TV_SHOW_ENDPOINT,
        {
          api_key: env.THE_MOVIE_DB_API_KEY,
          language: 'en-us',
        },
      );

      expect(mockRestDataSourceGet).toHaveBeenCalledWith(
        MEDIA_GENRES_CONSTANTS.GENRE_TV_SHOW_ENDPOINT,
        {
          api_key: env.THE_MOVIE_DB_API_KEY,
          language: 'en-us',
        },
      );

      expect(data!.trending_tv_shows).toEqual({
        on_the_air: {
          hasMore: true,
          total_pages: 2,
          total_results: 2,
          items: [tvshow],
        },
        top_rated: {
          hasMore: true,
          total_pages: 2,
          total_results: 2,
          items: [tvshow],
        },
        popular: {
          hasMore: true,
          total_pages: 2,
          total_results: 2,
          items: [tvshow],
        },
      });
    });
  });

  describe('Query - TV Show Detail', () => {
    it('should query the details of a tv show from TheMovieDB API and returns the result correctly', async () => {
      mockRestDataSourceGet
        .mockReturnValueOnce(rawTVShowDetail)
        .mockReturnValueOnce({ genres: tvGenres })
        .mockReturnValueOnce({ genres: tvGenres });

      const server = makeTestServer();

      const { query } = createTestClient(server);

      const { data } = await query({
        query: GET_TV_SHOW_DETAIL,
        variables: { id: '1', language: Iso6391Language.Ptbr },
      });

      expect(mockRestDataSourceGet.mock.calls.length).toBe(3);

      expect(mockRestDataSourceGet).toHaveBeenCalledWith(`${CONSTANTS.TV_ENDPOINT}/1`, {
        append_to_response: 'credits,similar,videos,reviews',
        api_key: env.THE_MOVIE_DB_API_KEY,
        language: 'pt-br',
      });

      expect(mockRestDataSourceGet).toHaveBeenCalledWith(
        MEDIA_GENRES_CONSTANTS.GENRE_TV_SHOW_ENDPOINT,
        {
          api_key: env.THE_MOVIE_DB_API_KEY,
          language: 'en-us',
        },
      );

      expect(data!.tv_show).toEqual(tvShowDetail);
    });
  });

  describe('Query - TV Show Images', () => {
    it('should query the images of a tv show from TheMovieDB API and returns the result correctly', async () => {
      mockRestDataSourceGet.mockReturnValueOnce({}).mockReturnValueOnce(getImagesResult);

      const server = makeTestServer();

      const { query } = createTestClient(server);

      const { data } = await query({
        query: GET_TV_SHOW_IMAGES,
        variables: { id: '1' },
      });

      expect(mockRestDataSourceGet.mock.calls.length).toBe(2);

      expect(mockRestDataSourceGet).toHaveBeenCalledWith(`${CONSTANTS.TV_ENDPOINT}/1`, {
        append_to_response: 'credits,similar,videos,reviews',
        api_key: env.THE_MOVIE_DB_API_KEY,
        language: 'en-us',
      });

      expect(mockRestDataSourceGet).toHaveBeenCalledWith(
        `${CONSTANTS.TV_ENDPOINT}/1/${CONSTANTS.TV_IMAGES_RESOURCE_ENDPOINT}`,
        {
          api_key: env.THE_MOVIE_DB_API_KEY,
        },
      );

      expect(data!.tv_show.images).toEqual(images);
    });

    it("should query the images of a movie from TheMovieDB API and returns an empty array when the movie doesn't exist", async () => {
      mockRestDataSourceGet
        .mockReturnValueOnce({})
        .mockReturnValueOnce({ status_code: CONSTANTS.TMDBAPI_ITEM_NOT_FOUND_CODE });

      const server = makeTestServer();

      const { query } = createTestClient(server);

      const { data } = await query({
        query: GET_TV_SHOW_IMAGES,
        variables: { id: '1' },
      });

      expect(mockRestDataSourceGet.mock.calls.length).toBe(2);

      expect(mockRestDataSourceGet).toHaveBeenCalledWith(`${CONSTANTS.TV_ENDPOINT}/1`, {
        append_to_response: 'credits,similar,videos,reviews',
        api_key: env.THE_MOVIE_DB_API_KEY,
        language: 'en-us',
      });

      expect(mockRestDataSourceGet).toHaveBeenCalledWith(
        `${CONSTANTS.TV_ENDPOINT}/1/${CONSTANTS.TV_IMAGES_RESOURCE_ENDPOINT}`,
        {
          api_key: env.THE_MOVIE_DB_API_KEY,
        },
      );

      expect(data!.tv_show.images).toEqual([]);
    });
  });
});
