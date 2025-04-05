import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MovieDetailsApiService } from './../services/movie-details-api.service';
import { forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { WatchlistService } from '../services/watchlist.service';
import { ToastService } from '../services/toastservice.service';
import { WatchlistItem } from '../models/watchlist-item.interface';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-details.component.html',
})
export class MovieDetailsComponent implements OnInit {
  movieId: string = '';
  movieDetails: any = {};
  recommendations: any = { results: [] };
  reviews: any = { results: [] };
  credits: any = { cast: [], crew: [] };
  isLoading: boolean = true;
  releaseYear: string = '';

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieDetailsApiService,
    private http: HttpClient,
    private watchlistService: WatchlistService, 
    private toastService: ToastService
  ) {}
  isInWatchlist(): boolean {
    return this.watchlistService.isInWatchlist(parseInt(this.movieId), 'movie');
  }

  
  toggleWatchlist(event: Event): void {
    event.stopPropagation();
    
    const isAlreadyInWatchlist = this.isInWatchlist();
    
    if (isAlreadyInWatchlist) {
      this.watchlistService.removeFromWatchlist(parseInt(this.movieId), 'movie');
      this.toastService.show(`"${this.movieDetails.title}" removed from watch list`, 'info');
    } else {
      const watchlistItem: WatchlistItem = {
        id: parseInt(this.movieId),
        title: this.movieDetails.original_title || this.movieDetails.title,
        posterUrl: this.movieDetails.poster_path ? `https://image.tmdb.org/t/p/w500/${this.movieDetails.poster_path}` : '',
        year: this.releaseYear,
        mediaType: 'movie',
        rating: this.movieDetails.vote_average,
        overview: this.movieDetails.overview,
        watched: false,
        favorite: false,
        dateAdded: Date.now()
      };
      
      this.watchlistService.addToWatchlist(watchlistItem);
      this.toastService.show(`"${this.movieDetails.title}" added to watch list`, 'success');
    }
  }
  
  isFavorite: boolean = false;
  
  toggleFavorite(event: Event): void {
    event.stopPropagation();
  
    this.isFavorite = !this.isFavorite;
    if (this.isFavorite) {
      this.watchlistService.addToFavorites(parseInt(this.movieId));
      this.toastService.show(`"${this.movieDetails.title}" added to favorites`, 'success');
    } else {
      this.watchlistService.removeFromFavorites(parseInt(this.movieId));
      this.toastService.show(`"${this.movieDetails.title}" removed from favorites`, 'info');
    }
  }
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.movieId = params['id'];
      this.loadMovieData();
    });
  }

  loadMovieData(): void {
    this.isLoading = true;

    const creditsCall = this.http.get(
      `https://api.themoviedb.org/3/movie/${this.movieId}/credits?api_key=2fcc1a253fc8e132b7699c023f783b1f`
    );

    forkJoin({
      details: this.movieService.getMovieDetails(this.movieId),
      recommendations: this.movieService.getRecommendations(this.movieId),
      reviews: this.movieService.getReviews(this.movieId),
      credits: creditsCall,
    }).subscribe({
      next: (response) => {
        this.movieDetails = response.details;
        this.recommendations = response.recommendations;
        this.reviews = response.reviews;
        this.credits = response.credits;

        if (this.movieDetails.release_date) {
          this.releaseYear = new Date(this.movieDetails.release_date)
            .getFullYear()
            .toString();
        } else {
          this.releaseYear = '';
        }

        this.isLoading = false;
        this.checkFavoriteStatus(); 
      },
      error: (error) => {
        console.error('Error fetching movie data:', error);
        this.isLoading = false;
      },
    });
  }

  private checkFavoriteStatus(): void {
    if (this.movieId) {
      this.isFavorite = this.watchlistService.isFavorite(parseInt(this.movieId));
    }
  }

  getImageUrl(path: string): string {
    if (!path) return '/api/placeholder/300/450';
    return `https://image.tmdb.org/t/p/w500${path}`;
  }

  getBackdropUrl(path: string): string {
    if (!path) return '/api/placeholder/1200/600';
    return `https://image.tmdb.org/t/p/original${path}`;
  }

  getDirectors(): any[] {
    if (!this.credits || !this.credits.crew) return [];
    return this.credits.crew.filter((person: any) => person.job === 'Director');
  }

  getCreators(): any[] {
    if (!this.credits || !this.credits.crew) return [];
    return this.credits.crew
      .filter(
        (person: any) =>
          person.job === 'Creator' || person.job === 'Executive Producer'
      )
      .slice(0, 2);
  }

  getVotePercentage(vote: number): string {
    return Math.round(vote * 10).toString() + '%';
  }
}
