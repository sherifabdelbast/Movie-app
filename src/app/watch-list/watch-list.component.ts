import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

interface WatchlistItem {
  id: number;
  title: string;
  posterUrl: string;
  year: string;
  mediaType: 'movie' | 'tv';
  rating?: number;
  // Movie specific properties
  runtime?: number;
  director?: string;
  // TV specific properties
  seasons?: number;
  network?: string;
  // Watch status
  watched: boolean;
  favorite: boolean;
}

@Component({
  selector: 'app-watch-list',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './watch-list.component.html',
  styleUrls: ['./watch-list.component.css']
})
export class WatchListComponent implements OnInit {
  watchlistItems: WatchlistItem[] = [];
  filteredItems: WatchlistItem[] = [];
  activeFilter: 'all' | 'movies' | 'tvshows' = 'all';

  constructor() {}

  ngOnInit(): void {
    // In a real app, you would fetch this from a service that interfaces with TMDB API
    this.loadWatchlistItems();
    this.filterItems('all');
  }

  loadWatchlistItems(): void {
    // Mock data - in a real app, this would come from a service
    this.watchlistItems = [
      {
        id: 1,
        title: 'Inception',
        posterUrl: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
        year: '2010',
        mediaType: 'movie',
        rating: 8.8,
        runtime: 148,
        director: 'Christopher Nolan',
        watched: false,
        favorite: true
      },
      {
        id: 2,
        title: 'Breaking Bad',
        posterUrl: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
        year: '2008-2013',
        mediaType: 'tv',
        rating: 9.5,
        seasons: 5,
        network: 'AMC',
        watched: true,
        favorite: true
      },
      {
        id: 3,
        title: 'The Dark Knight',
        posterUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        year: '2008',
        mediaType: 'movie',
        rating: 9.0,
        runtime: 152,
        director: 'Christopher Nolan',
        watched: true,
        favorite: false
      },
      {
        id: 4,
        title: 'Stranger Things',
        posterUrl: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
        year: '2016-Present',
        mediaType: 'tv',
        rating: 8.7,
        seasons: 4,
        network: 'Netflix',
        watched: false,
        favorite: false
      }
    ];
  }

  filterItems(filter: 'all' | 'movies' | 'tvshows'): void {
    this.activeFilter = filter;
    
    if (filter === 'all') {
      this.filteredItems = [...this.watchlistItems];
    } else if (filter === 'movies') {
      this.filteredItems = this.watchlistItems.filter(item => item.mediaType === 'movie');
    } else {
      this.filteredItems = this.watchlistItems.filter(item => item.mediaType === 'tv');
    }
  }

  removeFromWatchlist(id: number): void {
    this.watchlistItems = this.watchlistItems.filter(item => item.id !== id);
    this.filterItems(this.activeFilter); // Reapply filter
  }

  toggleFavorite(id: number): void {
    const item = this.watchlistItems.find(item => item.id === id);
    if (item) {
      item.favorite = !item.favorite;
    }
  }

  toggleWatched(id: number): void {
    const item = this.watchlistItems.find(item => item.id === id);
    if (item) {
      item.watched = !item.watched;
    }
  }

  getWatchActionText(item: WatchlistItem): string {
    return item.watched ? 'Watched' : 'Mark as Watched';
  }

  isMovie(item: WatchlistItem): boolean {
    return item.mediaType === 'movie';
  }

  isTvShow(item: WatchlistItem): boolean {
    return item.mediaType === 'tv';
  }
}