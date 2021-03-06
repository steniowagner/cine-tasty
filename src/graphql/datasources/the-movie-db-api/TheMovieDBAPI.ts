import { RESTDataSource } from 'apollo-datasource-rest';
import { URLSearchParamsInit } from 'apollo-server-env';

import { InvalidTMDBApiKeyError } from '@errors';
import * as TMDBAPITypes from '@tmdb-api-types';
import * as LibTypes from '@lib/types';

import TVShowsHandler from './handlers/tv-show/TVShowHandler';
import PeopleHandler from './handlers/people/PeopleHandler';
import PersonHandler from './handlers/person/PersonHandler';
import SearchHandler from './handlers/search/SearchHandler';
import MoviesHandler from './handlers/movies/MovieHandler';

import { makeRequestParams } from './helpers';
import CONSTANTS from './utils/constants';

class TheMovieDBAPI extends RESTDataSource {
  private tvshowsHandler: TVShowsHandler;
  private moviesHandler: MoviesHandler;
  private searchHandler: SearchHandler;
  private peopleHandler: PeopleHandler;
  private personHandler: PersonHandler;

  constructor() {
    super();

    this.tvshowsHandler = new TVShowsHandler(this.execGetRequest);
    this.moviesHandler = new MoviesHandler(this.execGetRequest);
    this.peopleHandler = new PeopleHandler(this.execGetRequest);
    this.searchHandler = new SearchHandler(this.execGetRequest);
    this.personHandler = new PersonHandler(this.execGetRequest);

    this.baseURL = CONSTANTS.BASE_URL;
  }

  private execGetRequest: TMDBAPITypes.GetTMDBApiRequest = async <P, R>(
    endpoint: string,
    params: P,
    language?: LibTypes.Iso6391Language | null,
  ): Promise<R & { status_code?: number }> => {
    const requestParams = makeRequestParams<P>(params, language) as URLSearchParamsInit;

    const result = await this.get<R & { status_code?: number }>(endpoint, requestParams);

    if (result.status_code === CONSTANTS.INVALID_API_KEY_CODE) {
      throw new InvalidTMDBApiKeyError();
    }

    return result;
  };

  async getPeople(args: LibTypes.QueryPeopleArgs): Promise<LibTypes.PeopleQueryResult> {
    return this.peopleHandler.handle(args);
  }

  async getPerson(
    args: LibTypes.QueryPersonArgs,
  ): Promise<LibTypes.PersonResponse | null> {
    return this.personHandler.handle(args);
  }

  async search(input: LibTypes.SearchInput): Promise<LibTypes.SearchQueryResult> {
    return this.searchHandler.handle(input);
  }

  async getMovie(args: LibTypes.QueryMovieArgs): Promise<LibTypes.MovieResponse | null> {
    return this.moviesHandler.getDetails(args);
  }

  async getTrendingMovies(
    args: LibTypes.TrendingMoviesArgs,
    endpoint: TMDBAPITypes.TrendingMoviesEndpoints,
  ): Promise<LibTypes.TrendingMoviesQueryResult> {
    return this.moviesHandler.getTrendings(args, endpoint);
  }

  async getMovieImages(id: string): Promise<string[]> {
    return this.moviesHandler.getImages(id);
  }

  async getTVShow(
    args: LibTypes.QueryTvShowArgs,
  ): Promise<LibTypes.TvShowResponse | null> {
    return this.tvshowsHandler.getDetails(args);
  }

  async getTrendingTVShows(
    args: LibTypes.TrendingTvShowsArgs,
    endpoint: TMDBAPITypes.TrendingTVShowsEndpoints,
  ): Promise<LibTypes.TrendingTvShowsQueryResult> {
    return this.tvshowsHandler.getTrendings(args, endpoint);
  }

  async getTVShowImages(id: string): Promise<string[]> {
    return this.tvshowsHandler.getImages(id);
  }

  async getTVShowSeason(
    args: LibTypes.QueryTvShowSeasonArgs,
  ): Promise<LibTypes.TvShowSeasonResponse | null> {
    return this.tvshowsHandler.getSeason(args);
  }
}

export default TheMovieDBAPI;
