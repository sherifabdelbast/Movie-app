// tv-show-details.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, inject, Output, EventEmitter } from '@angular/core';
import { TvShowService } from '../services/tv-show.service';
import { TvShow } from '../models/tvshow.interface';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';

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

  addToWishlist(event: Event) {
    event.stopPropagation(); // Prevent card click event
    // Add your wishlist logic here
    if (this.tvShow) {
      console.log('Added to wishlist:', this.tvShow.id);
    }
  }
  
  ngOnDestroy() {
    // Clean up all subscriptions when the component is destroyed
    this.subscriptions.unsubscribe();
  }
}