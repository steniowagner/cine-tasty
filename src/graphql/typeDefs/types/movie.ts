import { gql } from 'apollo-server';

export default gql`
  type Movie {
    adult: Boolean
    backdropPath: String
    genres(language: ISO6391Language): [String!]!
    id: ID
    originalLanguage: String
    originalTitle: String
    overview: String
    posterPath: String
    popularity: Float
    video: Boolean
    title: String
    voteAverage: Float
    releaseDate: String
    productionCompanies: [ProductionCompany!]!
    voteCount: Float
    runtime: Float
    spokenLanguages: [String!]!
    status: String
    tagline: String
    budget: Float
    homepage: String
    revenue: Float
    productionCountries: [String!]!
    cast: [CastItem!]!
    crew: [CrewItem!]!
    videos: [MediaVideo!]!
    images(id: ID!): [String!]!
    similar: [BaseMovie!]!
    reviews: [Review!]!
  }

  type MovieResponse {
    adult: Boolean
    backdrop_path: String
    genres(language: ISO6391Language): [String!]!
    id: ID
    original_language: String
    original_title: String
    overview: String
    poster_path: String
    popularity: Float
    video: Boolean
    title: String
    vote_average: Float
    release_date: String
    production_companies: [ProductionCompanyResponse!]!
    vote_count: Float
    runtime: Float
    spoken_languages: [String!]!
    status: String
    tagline: String
    budget: Float
    homepage: String
    revenue: Float
    production_countries: [String!]!
    cast: [CastItemResponse!]!
    crew: [CrewItemResponse!]!
    videos: [MediaVideo!]!
    images(id: ID!): [String!]!
    similar: [BaseMovieResponse!]!
    reviews: [Review!]!
  }

  type BaseMovie {
    originalTitle: String
    video: Boolean
    title: String
    adult: Boolean
    releaseDate: String
    backdropPath: String
    genreIds(language: ISO6391Language): [String!]!
    overview: String
    voteAverage: Float
    mediaType: String
    posterPath: String
    popularity: Float
    originalLanguage: String
    voteCount: Int
    id: Int
  }

  type BaseMovieResponse {
    original_title: String
    video: Boolean
    title: String
    adult: Boolean
    release_date: String
    backdrop_path: String
    genre_ids(language: ISO6391Language): [String!]!
    overview: String
    vote_average: Float
    media_type: String
    poster_path: String
    popularity: Float
    original_language: String
    vote_count: Int
    id: Int
  }

  input TrendingMoviesArgs {
    language: ISO6391Language
    page: Int!
  }

  type TrendingMoviesQueryResult {
    total_results: Int!
    total_pages: Int!
    items: [BaseMovie!]!
    hasMore: Boolean!
  }

  type TrendingMovies {
    now_playing(args: TrendingMoviesArgs!): TrendingMoviesQueryResult!
    popular(args: TrendingMoviesArgs!): TrendingMoviesQueryResult!
    top_rated(args: TrendingMoviesArgs!): TrendingMoviesQueryResult!
    upcoming(args: TrendingMoviesArgs!): TrendingMoviesQueryResult!
  }
`;
