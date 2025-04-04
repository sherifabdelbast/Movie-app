// src/app/services/watchlist.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { WatchlistItem } from '../models/watchlist-item.interface';

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {
  private watchlistItems: WatchlistItem[] = [];
  private watchlistSubject = new BehaviorSubject<WatchlistItem[]>([]);
  
  watchlist$ = this.watchlistSubject.asObservable();
  
  constructor() {
    this.loadWatchlist();
  }
  
  // Load watchlist from localStorage
  private loadWatchlist(): void {
    const savedWatchlist = localStorage.getItem('watchlist');
    if (savedWatchlist) {
      this.watchlistItems = JSON.parse(savedWatchlist);
      this.watchlistSubject.next([...this.watchlistItems]);
    }
  }
  
  // Add a new item to watchlist
  addToWatchlist(item: WatchlistItem): void {
    if (!this.isInWatchlist(item.id, item.mediaType)) {
      // Add timestamp when item was added
      const itemWithDate = {
        ...item,
        dateAdded: Date.now()
      };
      this.watchlistItems.push(itemWithDate);
      this.updateWatchlist();
    }
  }
  
  // Remove item from watchlist
  removeFromWatchlist(id: number, mediaType: 'movie' | 'tv'): void {
    this.watchlistItems = this.watchlistItems.filter(
      item => !(item.id === id && item.mediaType === mediaType)
    );
    this.updateWatchlist();
  }
  
  // Toggle favorite status
  toggleFavorite(id: number, mediaType: 'movie' | 'tv'): void {
    const item = this.findItem(id, mediaType);
    if (item) {
      item.favorite = !item.favorite;
      this.updateWatchlist();
    }
  }
  
  // Toggle watched status
  toggleWatched(id: number, mediaType: 'movie' | 'tv'): void {
    const item = this.findItem(id, mediaType);
    if (item) {
      item.watched = !item.watched;
      this.updateWatchlist();
    }
  }
  
  // Check if item is in watchlist
  isInWatchlist(id: number, mediaType: 'movie' | 'tv'): boolean {
    return this.watchlistItems.some(
      item => item.id === id && item.mediaType === mediaType
    );
  }
  
  // Get a specific item
  getItem(id: number, mediaType: 'movie' | 'tv'): WatchlistItem | undefined {
    return this.findItem(id, mediaType);
  }
  
  // Get watchlist count
  getWatchlistCount(): Observable<number> {
    return new Observable<number>(observer => {
      this.watchlist$.subscribe(items => {
        observer.next(items.length);
      });
    });
  }
  
  // Helper to find an item
  private findItem(id: number, mediaType: 'movie' | 'tv'): WatchlistItem | undefined {
    return this.watchlistItems.find(
      item => item.id === id && item.mediaType === mediaType
    );
  }
  
  // Save watchlist to localStorage and notify subscribers
  private updateWatchlist(): void {
    localStorage.setItem('watchlist', JSON.stringify(this.watchlistItems));
    this.watchlistSubject.next([...this.watchlistItems]);
  }
}