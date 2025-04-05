// tv-show-details.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, inject, Output, EventEmitter } from '@angular/core';
import { TvShowService } from '../services/tv-show.service';
import { TvShow } from '../models/tvshow.interface';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { WatchlistService } from '../services/watchlist.service';
import { WatchlistItem } from '../models/watchlist-item.interface';
import { ToastService } from '../services/toastservice.service';

@Component({
  selector: 'app-tv-show-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tv-show-details.component.html',
  styleUrls: ['./tv-show-details.component.css']
})
export class TvShowDetailsComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tvShowService = inject(TvShowService);
  private watchlistService = inject(WatchlistService);
  private toastService = inject(ToastService);
  private subscriptions = new Subscription();
  
  @Output() favorite = new EventEmitter<number>();
  
  isFavorite: boolean = false;
  tvShow?: TvShow;
  isLoading = true;
  errorMessage?: string;

  ngOnInit() {
    const routeSub = this.route.params.subscribe(params => {
      const id = params['id'];
      this.loadTvShowDetails(id);
    });
    this.subscriptions.add(routeSub);
  }

  private loadTvShowDetails(id: string) {
    this.isLoading = true;
    const detailsSub = this.tvShowService.getTvShowDetails(id)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (show) => {
          this.tvShow = show;
          // Check if this show is in favorites
          this.checkFavoriteStatus();
        },
        error: (err) => {
          console.error('Error loading TV show:', err);
          this.errorMessage = 'Failed to load TV show details';
        }
      });
    this.subscriptions.add(detailsSub);
  }
  
  // Add this method to check if the TV show is in favorites
  private checkFavoriteStatus(): void {
    if (this.tvShow) {
      // Check if this show is in favorites through your service
      // This depends on how your favorite service is implemented
      // For example:
      // this.isFavorite = this.watchlistService.isInFavorites(this.tvShow.id);
    }
  }
  
  goBack() {
    this.router.navigate(['/tv-shows']);
  }
  
  toggleFavorite(event: Event) {
    event.stopPropagation(); // Prevent propagation
    if (!this.tvShow) return;
    
    this.isFavorite = !this.isFavorite; // Toggle favorite status
    
    if (this.isFavorite) {
      this.watchlistService.addToFavorites(this.tvShow.id);
      this.toastService.show(`"${this.tvShow.name}" added to favorites`, 'success');
    } else {
      this.watchlistService.removeFromFavorites(this.tvShow.id);
      this.toastService.show(`"${this.tvShow.name}" removed from favorites`, 'info');
    }
    
    // Keep this for backward compatibility
    this.favorite.emit(this.tvShow.id);
  }

  formatDate(dateString: string | null): string {
    if (!dateString) return 'TBA';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.getFullYear().toString();
  }

  toggleWatchlist(event: Event) {
    event.stopPropagation();
    
    if (!this.tvShow) return;
    
    const isAlreadyInWatchlist = this.watchlistService.isInWatchlist(this.tvShow.id, 'tv');
    
    if (!isAlreadyInWatchlist) {
      const watchlistItem: WatchlistItem = {
        id: this.tvShow.id,
        title: this.tvShow.name,
        posterUrl: this.tvShow.poster_path ? `https://image.tmdb.org/t/p/w500${this.tvShow.poster_path}` : '',
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
    if (!this.tvShow) return false;
    return this.watchlistService.isInWatchlist(this.tvShow.id, 'tv');
  }
  
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}