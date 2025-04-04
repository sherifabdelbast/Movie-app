import { Component, OnInit } from '@angular/core';
import { MovieListService } from '../services/movie-list.service';
import { TvShowService } from '../services/tv-show.service';
import { MovieInterface } from '../models/movie.interface';
import { MovieListComponent } from '../movie-list/movie-list.component';
import { TvShowScrollableComponent } from '../tv-show-scrollable/tv-show-scrollable.component';
import { TeamComponent } from "../team/team.component";
import { TvShow } from '../models/tvshow.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MovieListComponent, TvShowScrollableComponent ,RouterLink , TeamComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // Update these to use the proper type
  trendingMovies: MovieInterface[] = [];
  topRatedMovies: MovieInterface[] = [];
  
  // For TV shows, you might want to create a TvShowInterface
  // But for now, we'll assume results have a similar structure
  popularTvShows: TvShow[] = [];

  constructor(
    private movieService: MovieListService,
    private tvShowService: TvShowService
  ) {}

  ngOnInit(): void {
    this.loadTrendingMovies();
    this.loadPopularTvShows();
    this.loadTopRatedMovies();
  }

  loadTrendingMovies(): void {
    this.movieService.getTrendingMovies().subscribe({
      next: (data) => {
        this.trendingMovies = data.results;
      },
      error: (error) => {
        console.error('Error fetching trending movies:', error);
      }
    });
  }

  loadPopularTvShows(): void {
    this.tvShowService.getPopularTvShows().subscribe({
      next: (data) => {
        this.popularTvShows = data.results;
      },
      error: (error) => {
        console.error('Error fetching popular TV shows:', error);
      }
    });
  }

  loadTopRatedMovies(): void {
    this.movieService.getTopRatedMovies().subscribe({
      next: (data) => {
        this.topRatedMovies = data.results;
      },
      error: (error) => {
        console.error('Error fetching top rated movies:', error);
      }
    });
  }
}