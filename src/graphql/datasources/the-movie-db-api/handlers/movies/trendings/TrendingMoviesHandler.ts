import { BaseMovie, TrendingMoviesQueryResult, TrendingMoviesArgs } from '@lib/types';
import {
  TrendingMoviesEndpoints,
  BasePaginationResponse,
  GetTMDBApiRequest,
  TheMovieDBHandler,
} from '@types';

type GetBaseMovieResponse = BasePaginationResponse & {
  results: BaseMovie[];
};

type GetRequestParams = { page: number } | { append_to_response: string } | {};

type Params = {
  endpoint: TrendingMoviesEndpoints;
  args: TrendingMoviesArgs;
};

class TrendingMoviesHandler implements TheMovieDBHandler<Params> {
  get: GetTMDBApiRequest;

  constructor(execGetRequest: GetTMDBApiRequest) {
    this.get = execGetRequest;
  }

  async handle({ endpoint, args }: Params): Promise<TrendingMoviesQueryResult> {
    const { page, language } = args;

    const {
      total_results: totalResults,
      total_pages: totalPages,
      results,
    } = await this.get<GetRequestParams, Promise<GetBaseMovieResponse>>(
      endpoint,
      { page },
      language,
    );

    return {
      hasMore: page < totalPages,
      items: results,
      totalResults,
      totalPages,
    };
  }
}

export default TrendingMoviesHandler;
