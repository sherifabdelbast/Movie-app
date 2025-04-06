// src/app/components/watch-list/watch-list.component.ts
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WatchlistService } from '../services/watchlist.service';
import { WatchlistItem } from '../models/watchlist-item.interface';
import {ToastService} from "../services/toastservice.service";


@Component({
  selector: 'app-watch-list',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './watch-list.component.html',
  styleUrls: ['./watch-list.component.css']
})
export class WatchListComponent implements OnInit {
  watchlistItems: WatchlistItem[] = [];
  filteredItems: WatchlistItem[] = [];
  activeFilter: 'all' | 'movies' | 'tvshows' | 'favorites' | 'watched' | 'unwatched' = 'all';
  sortOption: 'dateAdded' | 'title' | 'rating' = 'dateAdded';
  sortDirection: 'asc' | 'desc' = 'desc';
  
  constructor(private watchlistService: WatchlistService
    ,private toastService: ToastService
  ) {
    
  }
  
  ngOnInit(): void {
    // Subscribe to watchlist changes
    this.watchlistService.watchlist$.subscribe(items => {
      this.watchlistItems = items;
      this.applyFilterAndSort();
    });
    this.watchlistService.favoriteToggled$.subscribe(id => {
      if (id !== null) {
        // Update the UI when a favorite is toggled from elsewhere
        this.updateFavoriteStatus(id);
      }
    });
  }

  // Add this method to update UI when favorite status changes
private updateFavoriteStatus(id: number): void {
  const items = this.watchlistItems.filter(item => item.id === id);
  items.forEach(item => {
    item.favorite = this.watchlistService.isFavorite(id);
  });
  this.applyFilterAndSort();
}
  // Apply filter to watchlist items
  filterItems(filter: 'all' | 'movies' | 'tvshows' | 'favorites' | 'watched' | 'unwatched'): void {
    this.activeFilter = filter;
    this.applyFilterAndSort();
  }

  
  // Change sort option
  setSortOption(option: 'dateAdded' | 'title' | 'rating'): void {
    if (this.sortOption === option) {
      // Toggle direction if same option selected
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortOption = option;
      // Default to descending for rating and date, ascending for title
      this.sortDirection = option === 'title' ? 'asc' : 'desc';
    }
    this.applyFilterAndSort();
  }
  
  // Apply both filter and sort
  private applyFilterAndSort(): void {
    // First filter
    switch (this.activeFilter) {
      case 'all':
        this.filteredItems = [...this.watchlistItems];
        break;
      case 'movies':
        this.filteredItems = this.watchlistItems.filter(item => item.mediaType === 'movie');
        break;
      case 'tvshows':
        this.filteredItems = this.watchlistItems.filter(item => item.mediaType === 'tv');
        break;
      case 'favorites':
        this.filteredItems = this.watchlistItems.filter(item => item.favorite);
        break;
      case 'watched':
        this.filteredItems = this.watchlistItems.filter(item => item.watched);
        break;
      case 'unwatched':
        this.filteredItems = this.watchlistItems.filter(item => !item.watched);
        break;
    }
    
    // Then sort
    this.sortItems();
  }
  
  // Sort filtered items
  private sortItems(): void {
    this.filteredItems.sort((a, b) => {
      let comparison = 0;
      
      switch (this.sortOption) {
        case 'dateAdded':
          comparison = a.dateAdded - b.dateAdded;
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'rating':
          const ratingA = a.rating || 0;
          const ratingB = b.rating || 0;
          comparison = ratingA - ratingB;
          break;
      }
      
      // Reverse if descending
      return this.sortDirection === 'desc' ? -comparison : comparison;
    });
  }
  
  // Remove item from watchlist
  removeFromWatchlist(id: number, mediaType: 'movie' | 'tv'): void {
    this.watchlistService.removeFromWatchlist(id, mediaType);
  }
  
  // Toggle favorite status
  toggleFavorite(id: number, mediaType: 'movie' | 'tv'): void {
    // Get the current item to access its details
    const item = this.filteredItems.find(item => item.id === id && item.mediaType === mediaType);
    
    if (!item) return;
    
    // Toggle the favorite status
    item.favorite = !item.favorite;
    
    // Update the service and show appropriate toast message
    if (item.favorite) {
      this.watchlistService.addToFavorites(id);
      this.toastService.show(
        `"${item.title }" added to favorites`, 
        'success'
      );
    } else {
      this.watchlistService.removeFromFavorites(id);
      this.toastService.show(
        `"${item.title }" removed from favorites`, 
        'info'
      );
    }
    
    // Update the UI immediately without waiting for service response
    // This provides better user experience with immediate feedback
    this.filteredItems = [...this.filteredItems]; // Create new reference to trigger change detection
  }
  
  // Toggle watched status
  toggleWatched(id: number, mediaType: 'movie' | 'tv'): void {
    this.watchlistService.toggleWatched(id, mediaType);
  }
  
  // Get text for watch action button
  getWatchActionText(item: WatchlistItem): string {
    return item.watched ? 'Watched' : 'Mark as Watched';
  }
  
  // Check if item is a movie
  isMovie(item: WatchlistItem): boolean {
    return item.mediaType === 'movie';
  }
  
  // Check if item is a TV show
  isTvShow(item: WatchlistItem): boolean {
    return item.mediaType === 'tv';
  }
  
  // Get active class for filter buttons
  getFilterClass(filter: string): string {
    return this.activeFilter === filter ? 'active-filter' : '';
  }
  
  // Get active class for sort buttons
  getSortClass(option: string): string {
    if (this.sortOption === option) {
      return this.sortDirection === 'asc' ? 'active-sort asc' : 'active-sort desc';
    }
    return '';
  }


}