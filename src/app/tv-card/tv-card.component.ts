import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
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
export class TvCardComponent implements OnInit {
  @Input() tvShow!: TvShow;
  @Output() favorite = new EventEmitter<number>();
  
  isFavorite: boolean = false;
  
  constructor(
    private router: Router,
    private watchlistService: WatchlistService,
    private toastService: ToastService
  ) {}
  
  ngOnInit() {
    this.checkFavoriteStatus();
  }

  private checkFavoriteStatus(): void {
    if (this.tvShow) {
      this.isFavorite = this.watchlistService.isFavorite(this.tvShow.id);
    }
  }
  
  

  moveToTvShowDetails() {
    this.router.navigate(['/tv-shows', this.tvShow.id]);
  }
  
  toggleFavorite(event: Event) {
    event.stopPropagation(); // Prevent card click event
    
    this.isFavorite = !this.isFavorite; // Toggle favorite status
    
    if (this.isFavorite) {
      this.watchlistService.addToFavorites(this.tvShow.id);
      this.toastService.show(`"${this.tvShow.name}" added to favorites`, 'success');
    } else {
      this.watchlistService.removeFromFavorites(this.tvShow.id);
      this.toastService.show(`"${this.tvShow.name}" removed from favorites`, 'info');
    }
    
    this.favorite.emit(this.tvShow.id); // Keep this for backward compatibility
  }

  formatDate(dateString: string | null): string {
    if (!dateString) return 'TBA';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.getFullYear().toString();
  }

  toggleWatchlist(event: Event) {
    event.stopPropagation();
    
    const isAlreadyInWatchlist = this.watchlistService.isInWatchlist(this.tvShow.id, 'tv');
    
    if (!isAlreadyInWatchlist) {
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
      
      this.watchlistService.addToWatchlist(watchlistItem);
      this.toastService.show(`"${this.tvShow.name}" added to watch list`, 'success');
    } else {
      this.watchlistService.removeFromWatchlist(this.tvShow.id, 'tv');
      this.toastService.show(`"${this.tvShow.name}" removed from watch list`, 'info');
    }
  }
  
  isInWatchlist(): boolean {
    return this.watchlistService.isInWatchlist(this.tvShow.id, 'tv');
  }
}