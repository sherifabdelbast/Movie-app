import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MovieInterface } from '../models/movie.interface';
import { WatchlistItem } from '../models/watchlist-item.interface';
import { ToastService } from '../services/toastservice.service';
import { WatchlistService } from '../services/watchlist.service';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.css'
})
export class MovieCardComponent {
  @Input() movieItem!: MovieInterface;
  @Output() favorite = new EventEmitter<number>();
  

  isFavorite: boolean = false;
  constructor(
    private router: Router,
    private watchlistService: WatchlistService,
    private toastService: ToastService
  ) {}
  
  moveToMovieDetails() {
    this.router.navigate(['/movie-details', this.movieItem.id]);
  }
  
  formatDate(dateString: string | null): string {
    if (!dateString) return 'TBA';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.getFullYear().toString();
  }

  addToWishlist(event: Event) {
    event.stopPropagation();
  
    const isAlreadyInWatchlist = this.watchlistService.isInWatchlist(this.movieItem.id, 'movie');
  
    if (isAlreadyInWatchlist) {
      this.watchlistService.removeFromWatchlist(this.movieItem.id, 'movie');
      this.toastService.show(`"${this.movieItem.title}" removed from watch list`, 'info');
    } else {
      const watchlistItem: WatchlistItem = {
        id: this.movieItem.id,
        title: this.movieItem.original_title || this.movieItem.title,
        posterUrl: this.movieItem.poster_path ? `https://image.tmdb.org/t/p/w500/${this.movieItem.poster_path}` : '',
        year: this.formatDate(this.movieItem.release_date),
        mediaType: 'movie',
        rating: this.movieItem.vote_average,
        overview: this.movieItem.overview,
        watched: false,
        favorite: false,
        dateAdded: Date.now()
      };
  
      this.watchlistService.addToWatchlist(watchlistItem);
      this.toastService.show(`"${this.movieItem.title}" added to watch list`, 'success');
    }
  }
  

  toggleFavorite(event: Event) {
    event.stopPropagation();

    this.isFavorite = !this.isFavorite; // تغيير الحالة
    if (this.isFavorite) {
      this.watchlistService.addToFavorites(this.movieItem.id);
      this.toastService.show(`"${this.movieItem.title}" added to favorites`, 'success');
    } else {
      this.watchlistService.removeFromFavorites(this.movieItem.id);
      this.toastService.show(`"${this.movieItem.title}" removed from favorites`, 'info');
    }
    
  }

  ngOnInit() {
    this.checkFavoriteStatus();
  }

  
  private checkFavoriteStatus(): void {
    if (this.movieItem) {
      this.isFavorite = this.watchlistService.isFavorite(this.movieItem.id);
    }
  }

  
  isInWatchlist(): boolean {
    return this.watchlistService.isInWatchlist(this.movieItem.id, 'movie');
  }
}
