import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MovieDetailsApiService {
  http = inject(HttpClient);

  getMovieDetails(id: string): Observable<any> {
    return this.http.get(
      `https://api.themoviedb.org/3/movie/${id}?api_key=2fcc1a253fc8e132b7699c023f783b1f`
    );
  }

  getRecommendations(id: string): Observable<any> {
    return this.http.get(
      `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=2fcc1a253fc8e132b7699c023f783b1f`
    );
  }

  getReviews(id: string): Observable<any> {
    return this.http.get(
      `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=2fcc1a253fc8e132b7699c023f783b1f`
    );
  }

  constructor() {}
}
