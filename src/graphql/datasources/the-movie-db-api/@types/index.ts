import {
  CastItemResponse,
  CrewItemResponse,
  Iso6391Language,
  BaseTvShow,
  BaseMovie,
} from '@lib/types';

export type MediaGenre = {
  id: number;
  name: string;
};

export type Genres = {
  movie: MediaGenre[];
  tv: MediaGenre[];
};

type GetPersonImagesResultProfile = {
  vote_average?: number;
  width: number;
  aspect_ratio: number;
  file_path: string;
  height: number;
  vote_count: number;
};

export interface GetPersonImagesResult {
  profiles: GetPersonImagesResultProfile[];
}

export type BaseMediaType = BaseMovie | BaseTvShow;

export type MediaItem = BaseMediaType & { genre_ids: number[] };

export enum TrendingTVShowsEndpoints {
  OnTheAir = 'tv/on_the_air',
  Popular = 'tv/popular',
  TopRated = 'tv/top_rated',
  AiringToday = 'tv/airing_today',
}

export enum TrendingMoviesEndpoints {
  NowPlaying = 'movie/now_playing',
  Popular = 'movie/popular',
  TopRated = 'movie/top_rated',
  Upcoming = 'movie/upcoming',
}

export type MediaCredits = {
  cast: CastItemResponse[];
  crew: CrewItemResponse[];
};

export type MediaImage = {
  aspect_ratio?: number;
  file_path: string;
  height?: number;
  iso_639_1?: string;
  vote_average?: number;
  vote_count?: number;
  width?: number;
};

export type GetTMDBApiRequest = <P, R>(
  endpoint: string,
  params: P,
  language?: Iso6391Language | null,
) => Promise<R>;

export type GetImagesResponse = {
  backdrops: MediaImage[];
  posters: MediaImage[];
  id: number;
};

export type BasePaginationResponse = {
  total_results: number;
  total_pages: number;
  page: number;
};
