// src/app/models/watchlist-item.interface.ts
export interface WatchlistItem {
    id: number;
    title: string;
    posterUrl: string;
    year: string;
    mediaType: 'movie' | 'tv';
    rating?: number;
    overview?: string;
    // Movie specific properties
    runtime?: number;
    director?: string;
    // TV specific properties
    seasons?: number;
    network?: string;
    // Watch status
    watched: boolean;
    favorite: boolean;
    dateAdded: number; // timestamp
  }