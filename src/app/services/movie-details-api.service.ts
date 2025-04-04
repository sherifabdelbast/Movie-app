import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MovieDetailsApiService {
  http = inject(HttpClient);
  private apiKey = '2fcc1a253fc8e132b7699c023f783b1f';
  private baseUrl = 'https://api.themoviedb.org/3';

  getMovieDetails(id: string): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/movie/${id}?api_key=${this.apiKey}&append_to_response=videos,images`
    );
  }

  getRecommendations(id: string): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/movie/${id}/recommendations?api_key=${this.apiKey}`
    );
  }

  getReviews(id: string): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/movie/${id}/reviews?api_key=${this.apiKey}`
    );
  }

  getCredits(id: string): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/movie/${id}/credits?api_key=${this.apiKey}`
    );
  }

  getAllMovieData(id: string): Observable<any> {
    return forkJoin({
      details: this.getMovieDetails(id),
      recommendations: this.getRecommendations(id),
      reviews: this.getReviews(id),
      credits: this.getCredits(id)
    });
  }

  constructor() {}
}
