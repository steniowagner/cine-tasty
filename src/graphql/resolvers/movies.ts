import MediaGenresHandler from '../datasources/the-movie-db-api/handlers/media-genres/MediaGenresHandler';

import {
  QueryResolvers,
  TrendingMoviesQueryResult,
  TrendingMoviesNow_PlayingArgs as TrendingMoviesNowPlayingArgs,
  TrendingMoviesPopularArgs,
  TrendingMoviesTop_RatedArgs as TrendingMoviesTopRatedArgs,
  TrendingMoviesUpcomingArgs,
  QueryMovieArgs,
  BaseMovieGenre_IdsArgs as BaseMovieGenreIdsArgs,
  Movie,
  MovieGenresArgs,
  MediaType,
  CastItem,
  CrewItem,
  MediaVideo,
  MovieImagesArgs,
  Review,
  BaseMovie,
} from '../../lib/types';
import {
  Context,
  MediaGenre,
  MediaItem,
  MediaCredits,
  TrendingMoviesEndpoints,
  BasePaginationResponse,
} from '../../@types';

const mediaGenres = new MediaGenresHandler();

type MovieVideos = {
  results: MediaVideo[];
};

type SimilarMovies = {
  results: BaseMovie[];
};

type MovieReview = BasePaginationResponse & { results: Review[] };

const BASE_VIDEO_THHUMBNAIL_URL = 'https://img.youtube.com/vi';

const resolvers: QueryResolvers = {
  Query: {
    trending_movies: (): {} => ({}),

    movie: (
      _: {},
      args: QueryMovieArgs,
      { dataSources }: Context,
    ): Promise<Movie | null> => dataSources.tmdb.getMovie(args),
  },

  BaseMovie: {
    genre_ids: (
      { genre_ids }: MediaItem,
      { language }: BaseMovieGenreIdsArgs,
    ): Promise<string[]> =>
      mediaGenres.handle({
        mediaType: MediaType.Movie,
        genresIds: genre_ids,
        language,
      }),
  },

  Movie: {
    spoken_languages: ({
      spoken_languages,
    }: {
      spoken_languages: Array<{ name: string }>;
    }): string[] => spoken_languages.map(({ name }) => name),

    production_countries: ({
      production_countries,
    }: {
      production_countries: Array<{ name: string }>;
    }): string[] => production_countries.map(({ name }) => name),

    cast: ({ credits }: { credits: MediaCredits }): CastItem[] =>
      credits.cast.map(castItem => ({
        name: castItem.name,
        profile_path: castItem.profile_path,
        id: castItem.id,
        character: castItem.character,
      })),

    crew: ({ credits }: { credits: MediaCredits }): CrewItem[] =>
      credits.crew.map(castItem => ({
        profile_path: castItem.profile_path,
        department: castItem.department,
        id: castItem.id,
        job: castItem.job,
        name: castItem.name,
      })),

    images: (
      _: {},
      { id }: MovieImagesArgs,
      { dataSources }: Context,
    ): Promise<string[]> => dataSources.tmdb.getMovieImages(id),

    reviews: ({ reviews }: { reviews: MovieReview }): Review[] => reviews.results,

    similar: ({ similar }: { similar: SimilarMovies }): BaseMovie[] => similar.results,

    videos: ({ videos }: { videos: MovieVideos }): MediaVideo[] =>
      videos.results
        .filter(({ site }) => site === 'YouTube')
        .map(video => ({
          key: video.key,
          name: video.name,
          site: video.site,
          id: `${video.id}`,
          type: video.type,
          thumbnail: {
            extra_small: `${BASE_VIDEO_THHUMBNAIL_URL}/${video.key}/default.jpg`,
            small: `${BASE_VIDEO_THHUMBNAIL_URL}/${video.key}/mqdefault.jpg`,
            medium: `${BASE_VIDEO_THHUMBNAIL_URL}/${video.key}/hqdefault.jpg`,
            large: `${BASE_VIDEO_THHUMBNAIL_URL}/${video.key}/sddefault.jpg`,
            extra_large: `${BASE_VIDEO_THHUMBNAIL_URL}/${video.key}/maxresdefault.jpg`,
          },
        })),

    genres: (
      { genres }: { genres: Array<MediaGenre> },
      { language }: MovieGenresArgs,
    ): Promise<string[]> => {
      const genresIds = genres.map(({ id }) => id);

      return mediaGenres.handle({
        mediaType: MediaType.Movie,
        genresIds,
        language,
      });
    },
  },

  TrendingMovies: {
    now_playing: (
      _: {},
      { args }: TrendingMoviesNowPlayingArgs,
      { dataSources }: Context,
    ): Promise<TrendingMoviesQueryResult> =>
      dataSources.tmdb.getTrendingMoviesItem(args, TrendingMoviesEndpoints.NowPlaying),

    popular: (
      _: {},
      { args }: TrendingMoviesPopularArgs,
      { dataSources }: Context,
    ): Promise<TrendingMoviesQueryResult> =>
      dataSources.tmdb.getTrendingMoviesItem(args, TrendingMoviesEndpoints.Popular),

    top_rated: (
      _: {},
      { args }: TrendingMoviesTopRatedArgs,
      { dataSources }: Context,
    ): Promise<TrendingMoviesQueryResult> =>
      dataSources.tmdb.getTrendingMoviesItem(args, TrendingMoviesEndpoints.TopRated),

    upcoming: (
      _: {},
      { args }: TrendingMoviesUpcomingArgs,
      { dataSources }: Context,
    ): Promise<TrendingMoviesQueryResult> =>
      dataSources.tmdb.getTrendingMoviesItem(args, TrendingMoviesEndpoints.Upcoming),
  },
};

export default resolvers;
