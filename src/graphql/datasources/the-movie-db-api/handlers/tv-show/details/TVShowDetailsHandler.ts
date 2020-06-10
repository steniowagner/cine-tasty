import { GetTMDBApiRequest } from '@types';
import { QueryTvShowArgs, TvShowResponse } from '@lib/types';

import TheMovieDBHandler from '../../TheMovieDBHandler';
import CONSTANTS from '../../../utils/constants';

type GetRequestParams = { page: number } | { append_to_response: string } | {};

class TVShowDetailsHandler extends TheMovieDBHandler<QueryTvShowArgs> {
  constructor(getRequest: GetTMDBApiRequest) {
    super(getRequest);
  }

  async handle({ id, language }: QueryTvShowArgs): Promise<TvShowResponse | null> {
    const tvshow = await this.get<
      GetRequestParams,
      Promise<TvShowResponse & { status_code?: number }>
    >(
      `${CONSTANTS.TV_ENDPOINT}/${id}`,
      {
        append_to_response: CONSTANTS.APPEND_TO_TV_SHOW_RESPONSE,
      },
      language,
    );

    if (tvshow.status_code === CONSTANTS.TMDBAPI_ITEM_NOT_FOUND_CODE) {
      return null;
    }

    return tvshow;
  }
}

export default TVShowDetailsHandler;