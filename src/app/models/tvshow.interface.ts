export interface TvShow {
  id: number;
  name: string;
  poster_path: string | null; 
  first_air_date: string | null; 
  vote_average: number ;
  backdrop_path: string | null;
  overview: string;
  vote_count: number;
  popularity: number;
  origin_country: string[];
  original_language: string;
  genre_ids: number[];
  adult: boolean;
  status?: string; 
  number_of_seasons: number;
  number_of_episodes: number;
  episode_run_time: number[];
  networks: {
    name: string;
    logo_path: string;
  }[];
  seasons: {
    season_number: number;
    name: string;
    episode_count: number;
    air_date: string;
  }[];
}