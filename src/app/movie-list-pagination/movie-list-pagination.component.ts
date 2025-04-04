import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { MovieListService } from '../services/movie-list.service';
import { MovieInterface } from '../models/movie.interface';

@Component({
  selector: 'app-movie-list-pagination',
  imports: [CommonModule, MovieCardComponent],
  templateUrl: './movie-list-pagination.component.html',
  styleUrl: './movie-list-pagination.component.css'
})
export class MovieListPaginationComponent implements OnInit {
  movies: MovieInterface[] = [];
  currentPage = 1;
  totalPages = 0;
  isLoading = false;
  moviesRequestsService = inject(MovieListService);

  ngOnInit() {
    this.loadMovies();
  }

  loadMovies(): void {
    this.isLoading = true;
    this.moviesRequestsService.getMoviesList(this.currentPage).subscribe({
      next: (response: any) => {
        this.movies = response.results;
        this.totalPages = response.total_pages;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching movies', error);
        this.isLoading = false;
      }
    });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }

    this.currentPage = page;
    this.loadMovies();

    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  receiveFromChild(id: number) {
    this.movies = this.movies.filter(movie => movie.id !== id);
  }
}
