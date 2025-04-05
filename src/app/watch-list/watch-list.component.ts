// src/app/components/watch-list/watch-list.component.ts
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WatchlistService } from '../services/watchlist.service';
import { WatchlistItem } from '../models/watchlist-item.interface';

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
  
  constructor(private watchlistService: WatchlistService) {}
  
  ngOnInit(): void {
    // Subscribe to watchlist changes
    this.watchlistService.watchlist$.subscribe(items => {
      this.watchlistItems = items;
      this.applyFilterAndSort();
    });
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
    this.watchlistService.toggleFavorite(id, mediaType);
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

  // Add this method to the WatchListComponent class in watch-list.component.ts
isAlreadyInWatchlist(id: number, mediaType: 'movie' | 'tv'): boolean {
  // Use the watchlistService to check if the item exists
  return this.watchlistService.isInWatchlist(id, mediaType);
}
}