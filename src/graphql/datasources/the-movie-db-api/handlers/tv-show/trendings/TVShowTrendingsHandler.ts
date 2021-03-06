import { TrendingTvShowsQueryResult, TrendingTvShowsArgs, BaseTvShow } from '@lib/types';
import {
  TrendingTVShowsEndpoints,
  BasePaginationResponse,
  GetTMDBApiRequest,
} from '@tmdb-api-types';

import TheMovieDBAPIHandler from '../../TheMovieDBAPIHandler';

type GetRequestParams = { page: number } | { append_to_response: string } | {};

type GetBaseTVShowResponse = BasePaginationResponse & {
  results: BaseTvShow[];
};

export type Params = {
  endpoint: TrendingTVShowsEndpoints;
  args: TrendingTvShowsArgs;
};

class TVShowTrendingsHandler extends TheMovieDBAPIHandler<Params> {
  constructor(getRequest: GetTMDBApiRequest) {
    super(getRequest);
  }

  async handle({ endpoint, args }: Params): Promise<TrendingTvShowsQueryResult> {
    const { page, language } = args;

    const {
      total_results: totalResults,
      total_pages: totalPages,
      results,
    } = await this.get<GetRequestParams, Promise<GetBaseTVShowResponse>>(
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

export default TVShowTrendingsHandler;
