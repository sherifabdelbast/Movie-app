import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { MovieListService } from '../services/movie-list.service';
import { MovieInterface } from '../models/movie.interface';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, MovieCardComponent],
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css']
})
export class MovieListComponent {
  allMovies: MovieInterface[] = [];
  movies: MovieInterface[] = [];
  moviesRequestsService = inject(MovieListService);

  ngOnInit() {
    this.moviesRequestsService.getMoviesList().subscribe((response: any) => {
      this.allMovies = response.results;
      this.movies = [...this.allMovies];
    });
  }
  
  filterMovies(range: 'today' | 'week' | 'all') {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    switch(range) {
      case 'today':
        this.movies = this.allMovies.filter(movie => {
          if (!movie.release_date) return false;
          const releaseDate = new Date(movie.release_date);
          return releaseDate.toDateString() === today.toDateString();
        });
        break;

      case 'week':
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999); 
        
        this.movies = this.allMovies.filter(movie => {
          if (!movie.release_date) return false;
          const releaseDate = new Date(movie.release_date);
          return releaseDate >= today && releaseDate <= endOfWeek;
        });
        break;

      case 'all':
        this.movies = [...this.allMovies];
        break;
    }
  }

  receiveFromChild(id: number) {
    this.allMovies = this.allMovies.filter(movie => movie.id !== id);
    this.movies = this.movies.filter(movie => movie.id !== id);
  }
}
