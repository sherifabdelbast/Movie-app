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
        },
        error: (err) => {
          console.error('Error loading TV show:', err);
          this.errorMessage = 'Failed to load TV show details';
        }
      });
    this.subscriptions.add(detailsSub);
  }
  
  goBack() {
    this.router.navigate(['/tv-shows']);
  }
  
  toggleFavorite(event: Event) {
    event.stopPropagation(); // Prevent card click event
    if (this.tvShow) {
      this.favorite.emit(this.tvShow.id);
      console.log('Added to favorite:', this.tvShow.id);
    }
  }

  formatDate(dateString: string | null): string {
    if (!dateString) return 'TBA';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.getFullYear().toString();
  }

  addToWishlist(event: Event) {
    event.stopPropagation(); // Prevent card click event
    
    if (!this.tvShow) return;
    
    // Check if the item is already in the watchlist
    const isAlreadyInWatchlist = this.watchlistService.isInWatchlist(this.tvShow.id, 'tv');
    
    if (!isAlreadyInWatchlist) {
      // Create a watchlist item from the tvShow data
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
      
      // Add to watchlist
      this.watchlistService.addToWatchlist(watchlistItem);
      
      // Show success toast
      this.toastService.show(`"${this.tvShow.name}" تمت إضافته إلى قائمة المشاهدة`, 'success');
      
      console.log('Added to watchlist:', this.tvShow.id);
    } else {
      // If already in watchlist, show info message and offer to navigate
      this.toastService.show(`"${this.tvShow.name}" موجود بالفعل في قائمة المشاهدة`, 'info');
      console.log('Already in watchlist:', this.tvShow.id);
    }
  }
  
  // Check if the TV show is already in the watchlist
  isInWatchlist(): boolean {
    if (!this.tvShow) return false;
    return this.watchlistService.isInWatchlist(this.tvShow.id, 'tv');
  }
  
  ngOnDestroy() {
    // Clean up all subscriptions when the component is destroyed
    this.subscriptions.unsubscribe();
  }
}