import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TvShow } from '../models/tvshow.interface';

@Injectable({
  providedIn: 'root'
})
export class TvShowService {
  
  constructor(private http: HttpClient) { }
  
  getPopularTvShows(): Observable<{ page: number, results: TvShow[], total_results: number, total_pages: number }> {
    return this.http.get<{ page: number, results: TvShow[], total_results: number, total_pages: number }>(
      'https://api.themoviedb.org/3/tv/popular?api_key=2fcc1a253fc8e132b7699c023f783b1f'
    );
  }

  // tv-show.service.ts
getTvShowDetails(id: string): Observable<TvShow> {
  return this.http.get<TvShow>(
    `https://api.themoviedb.org/3/tv/${id}?api_key=2fcc1a253fc8e132b7699c023f783b1f`
  );
}
}