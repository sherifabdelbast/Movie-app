import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Define an interface for search results
export interface SearchResult {
  page: number;
  results: SearchItem[];
  total_pages: number;
  total_results: number;
}

export interface SearchItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  media_type: 'movie' | 'tv';
  overview: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiKey = '2fcc1a253fc8e132b7699c023f783b1f';
  private baseUrl = 'https://api.themoviedb.org/3';

  constructor(private http: HttpClient) { }

  search(query: string, page: number = 1): Observable<SearchResult> {
    if (!query.trim()) {
      throw new Error('Search query cannot be empty');
    }
    
    return this.http.get<SearchResult>(
      `${this.baseUrl}/search/multi?api_key=${this.apiKey}&query=${encodeURIComponent(query)}&page=${page}`
    );
  }
}