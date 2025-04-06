// search.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter, switchMap, catchError } from 'rxjs/operators';
import { Subject, Observable, of } from 'rxjs';
import { SearchService, SearchItem } from '../services/search-service.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative">
      <input 
        type="text" 
        [(ngModel)]="searchQuery"
        (input)="onSearchInput()"
        placeholder="Search ..." 
        class="bg-gray-800 text-white rounded-full py-2 pl-4 pr-10 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
      <button class="absolute right-0 top-0 mt-2 mr-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
      
      <!-- Search Results Dropdown -->
      <div *ngIf="searchResults && searchResults.length > 0" class="absolute z-10 w-full mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
        <div *ngFor="let result of searchResults" class="flex items-center p-2 hover:bg-gray-800 cursor-pointer" (click)="navigateToItem(result)">
          <img 
            *ngIf="result.poster_path" 
            [src]="'https://image.tmdb.org/t/p/w92' + result.poster_path" 
            [alt]="result.title || result.name"
            class="w-10 h-15 object-cover rounded mr-3"
          >
          <div *ngIf="!result.poster_path" class="w-10 h-15 bg-gray-700 rounded mr-3 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div class="overflow-hidden">
            <p class="font-medium text-white truncate">{{ result.title || result.name }}</p>
            <p class="text-xs text-gray-400 truncate">
              {{ result.media_type === 'movie' ? 'Movie' : 'TV Show' }} • 
              {{ result.release_date || result.first_air_date || 'Unknown date' | slice:0:4 }}
            </p>
          </div>
        </div>
        <div class="p-2 text-center text-sm text-indigo-400 border-t border-gray-700 hover:bg-gray-800 cursor-pointer" (click)="viewAllResults()">
          View all results
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class SearchComponent implements OnInit {
  searchQuery = '';
  searchResults: SearchItem[] = [];
  private searchTerms = new Subject<string>();
  loading = false;
  
  constructor(
    private searchService: SearchService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    // Set up the search term pipeline with debounce
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(term => term.length > 2),
      switchMap(term => {
        this.loading = true;
        return this.searchService.search(term).pipe(
          catchError(() => {
            this.loading = false;
            return of({ results: [], page: 1, total_pages: 0, total_results: 0 });
          })
        );
      })
    ).subscribe(results => {
      this.searchResults = results.results.slice(0, 5); // Limit to 5 results for dropdown
      this.loading = false;
    });
  }
  
  onSearchInput(): void {
    if (this.searchQuery.trim()) {
      this.searchTerms.next(this.searchQuery);
    } else {
      this.searchResults = [];
    }
  }
  
  navigateToItem(item: SearchItem): void {
    if (item.media_type === 'movie') {
      this.router.navigate(['/movie-details', item.id]);
    } else if (item.media_type === 'tv') {
      this.router.navigate(['/tv-shows', item.id]);
    }
    this.clearSearch();
  }
  
  viewAllResults(): void {
    this.router.navigate(['/search-results'], { 
      queryParams: { query: this.searchQuery } 
    });
    this.clearSearch();
  }
  
  clearSearch(): void {
    this.searchResults = [];
  }
}