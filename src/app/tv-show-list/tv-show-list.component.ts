// tv-show-list.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { TvCardComponent } from '../tv-card/tv-card.component';
import { TvShowService } from '../services/tv-show.service';
import { TvShow } from '../models/tvshow.interface';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-tv-show-list',
  standalone: true,
  imports: [CommonModule, TvCardComponent],
  templateUrl: './tv-show-list.component.html',
  styleUrls: ['./tv-show-list.component.css']
})
export class TvShowListComponent implements OnInit {
  allShows: TvShow[] = [];
  tvShows: TvShow[] = [];
  isLoading = true;
  activeFilter: 'today' | 'week' | 'all' = 'all';
  
  // Pagination properties
  currentPage = 1;
  totalPages = 1;
  totalResults = 0;
  
  private tvShowService = inject(TvShowService);

  ngOnInit() {
    this.loadShows();
  }
  
  loadShows(page: number = 1) {
    this.isLoading = true;
    this.tvShowService.getPopularTvShows(page)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response) => {
          this.allShows = response.results;
          this.currentPage = response.page;
          this.totalPages = response.total_pages;
          this.totalResults = response.total_results;
          this.filterShows(this.activeFilter);
        },
        error: (error) => {
          console.error('Error loading TV shows', error);
          this.tvShows = [];
        }
      });
  }

  filterShows(range: 'today' | 'week' | 'all') {
    this.activeFilter = range;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch(range) {
      case 'today':
        this.tvShows = this.allShows.filter(show => {
          if (!show.first_air_date) return false;
          const airDate = new Date(show.first_air_date);
          return airDate.toDateString() === today.toDateString();
        });
        break;
      case 'week':
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + 6);
        this.tvShows = this.allShows.filter(show => {
          if (!show.first_air_date) return false;
          const airDate = new Date(show.first_air_date);
          return airDate >= today && airDate <= endOfWeek;
        });
        break;
      case 'all':
        this.tvShows = [...this.allShows];
        break;
    }
  }
  
  // Calculate the page numbers to display
  getVisiblePageNumbers(): number[] {
    const visiblePages: number[] = [];
    
    // Show 5 pages centered around current page if possible
    const startPage = Math.max(1, this.currentPage - 2);
    const endPage = Math.min(this.totalPages, this.currentPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(i);
    }
    
    return visiblePages;
  }
  
  // Pagination methods
  goToPage(page: number) {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }
    
    this.loadShows(page);
  }
  
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }
  
  previousPage() {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }
}