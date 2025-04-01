import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieListService {

  http = inject(HttpClient);

  constructor() { }
  getMoviesList ():Observable<any>{
    return this.http.get('https://api.themoviedb.org/3/movie/now_playing?api_key=2fcc1a253fc8e132b7699c023f783b1f',{
    })
  }
}
