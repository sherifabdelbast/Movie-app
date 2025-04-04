import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MovieInterface } from '../models/movie.interface';

@Injectable({
  providedIn: 'root'
})
export class MovieListService {
  private apiKey = '2fcc1a253fc8e132b7699c023f783b1f';
  private baseUrl = 'https://api.themoviedb.org/3';

  constructor(private http: HttpClient) { }

  // Your existing method
  getMoviesList(page: number = 1): Observable<MovieInterface> {
    return this.http.get<MovieInterface>(
      `${this.baseUrl}/movie/now_playing?api_key=${this.apiKey}&page=${page}`
    );
  }

  // Add the missing methods that are called in HomeComponent
  getTrendingMovies(page: number = 1): Observable<MovieInterface> {
    return this.http.get<MovieInterface>(
      `${this.baseUrl}/trending/movie/week?api_key=${this.apiKey}&page=${page}`
    );
  }

  getTopRatedMovies(page: number = 1): Observable<MovieInterface> {
    return this.http.get<MovieInterface>(
      `${this.baseUrl}/movie/top_rated?api_key=${this.apiKey}&page=${page}`
    );
  }
}