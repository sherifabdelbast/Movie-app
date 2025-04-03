// tv-show-details.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, Output, EventEmitter } from '@angular/core';
import { TvShowService } from '../services/tv-show.service';
import { TvShow } from '../models/tvshow.interface';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-tv-show-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tv-show-details.component.html',
  styleUrls: ['./tv-show-details.component.css']
})
export class TvShowDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tvShowService = inject(TvShowService);
  
  @Output() favorite = new EventEmitter<number>();
  
  tvShow?: TvShow;
  isLoading = true;
  errorMessage?: string;

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.loadTvShowDetails(id);
    });
  }

  private loadTvShowDetails(id: string) {
    this.isLoading = true;
    this.tvShowService.getTvShowDetails(id)
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
}