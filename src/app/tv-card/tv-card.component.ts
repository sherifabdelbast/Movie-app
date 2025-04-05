import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TvShow } from '../models/tvshow.interface';
import { WatchlistService } from '../services/watchlist.service';
import { WatchlistItem } from '../models/watchlist-item.interface';
import { ToastService } from '../services/toastservice.service';

@Component({
  selector: 'app-tv-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tv-card.component.html',
  styleUrl: './tv-card.component.css'
})
export class TvCardComponent {
  @Input() tvShow!: TvShow;
  @Output() favorite = new EventEmitter<number>();
  
  constructor(
    private router: Router,
    private watchlistService: WatchlistService,
    private toastService: ToastService
  ) {}
  
  moveToTvShowDetails() {
    this.router.navigate(['/tv-shows', this.tvShow.id]);
  }
  
  toggleFavorite(event: Event) {
    event.stopPropagation(); // Prevent card click event
    this.favorite.emit(this.tvShow.id);
    console.log('Added to favorite:', this.tvShow.id);
  }

  formatDate(dateString: string | null): string {
    if (!dateString) return 'TBA';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.getFullYear().toString();
  }

  toggleWatchlist(event: Event) {
    event.stopPropagation(); // Prevent card click event
    
    // Check if the item is already in the watchlist
    const isAlreadyInWatchlist = this.watchlistService.isInWatchlist(this.tvShow.id, 'tv');
    
    if (!isAlreadyInWatchlist) {
      // Create a watchlist item from the tvShow data
      const watchlistItem: WatchlistItem = {
        id: this.tvShow.id,
        title: this.tvShow.name,
        posterUrl: this.tvShow.poster_path ? `https://image.tmdb.org/t/p/w500/${this.tvShow.poster_path}` : '',
        year: this.formatDate(this.tvShow.first_air_date),
        mediaType: 'tv',
        rating: this.tvShow.vote_average,
        overview: this.tvShow.overview,
        seasons: this.tvShow.number_of_seasons,
        network: this.tvShow.networks && this.tvShow.networks.length > 0 ? this.tvShow.networks[0].name : undefined,
        watched: false,
        favorite: false,
        dateAdded: Date.now()
      };
      
      // Add to watchlist
      this.watchlistService.addToWatchlist(watchlistItem);
      
      // Show success toast
      this.toastService.show(`"${this.tvShow.name}" تمت إضافته إلى قائمة المشاهدة`, 'success');
    } else {
      // Remove from watchlist
      this.watchlistService.removeFromWatchlist(this.tvShow.id, 'tv');
      
      // Show removed toast
      this.toastService.show(`"${this.tvShow.name}" تمت إزالته من قائمة المشاهدة`, 'info');
    }
  }
  
  // Check if the TV show is already in the watchlist
  isInWatchlist(): boolean {
    return this.watchlistService.isInWatchlist(this.tvShow.id, 'tv');
  }
}