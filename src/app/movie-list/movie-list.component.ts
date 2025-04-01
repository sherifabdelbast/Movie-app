import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { MovieListService } from '../services/movie-list.service';

interface Movie {
  id: number;
  title: string;
}
@Component({
  selector: 'app-movie-list',
  imports: [CommonModule,MovieCardComponent],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.css'
})
export class MovieListComponent {
movies !: Movie[];
moviesRequestsService = inject(MovieListService );


constructor() {}

ngOnInit(){
  this.moviesRequestsService.getMoviesList().subscribe((response : any) => {
    this.movies = response.results;
  });
}

receiveFromChild(id : number) {
console.log("PARENT COMPONENT",id);
this.movies=this.movies.filter((movie: Movie) => movie.id !== id);
}
}
