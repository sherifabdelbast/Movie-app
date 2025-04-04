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
  
  constructor(
    private router: Router,
    private watchlistService: WatchlistService,
    private toastService: ToastService
  ) {}
  
  moveToMovieDetails() {
    this.router.navigate(['/movie-details', this.movieItem.id]);
  }
  
  toggleFavorite(event: Event) {
    event.stopPropagation(); // Prevent card click event
    this.favorite.emit(this.movieItem.id);
    console.log('Added to favorite:', this.movieItem.id);
  }

  formatDate(dateString: string | null): string {
    if (!dateString) return 'TBA';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.getFullYear().toString();
  }

  addToWishlist(event: Event) {
    event.stopPropagation(); // Prevent card click event
    
    // Check if the item is already in the watchlist
    const isAlreadyInWatchlist = this.watchlistService.isInWatchlist(this.movieItem.id, 'movie');
    
    if (!isAlreadyInWatchlist) {
      // Create a watchlist item from the movie data
      const watchlistItem: WatchlistItem = {
        id: this.movieItem.id,
        title: this.movieItem.original_title || this.movieItem.title,
        posterUrl: this.movieItem.poster_path ? `https://image.tmdb.org/t/p/w500/${this.movieItem.poster_path}` : '',
        year: this.formatDate(this.movieItem.release_date),
        mediaType: 'movie',
        rating: this.movieItem.vote_average,
        overview: this.movieItem.overview,
        // runtime: this.movieItem.runtime,
        // director: this.getDirector(this.movieItem),
        watched: false,
        favorite: false,
        dateAdded: Date.now()
      };
      
      // Add to watchlist
      this.watchlistService.addToWatchlist(watchlistItem);
      
      // Show success toast
      this.toastService.show(`"${this.movieItem.title}" تمت إضافته إلى قائمة المشاهدة`, 'success');
      
      console.log('Added to watchlist:', this.movieItem.id);
    } else {
      // If already in watchlist, show info message
      this.toastService.show(`"${this.movieItem.title}" موجود بالفعل في قائمة المشاهدة`, 'info');
      console.log('Already in watchlist:', this.movieItem.id);
    }
  }

  isInWatchlist(): boolean {
    return this.watchlistService.isInWatchlist(this.movieItem.id, 'movie');
  }
}
