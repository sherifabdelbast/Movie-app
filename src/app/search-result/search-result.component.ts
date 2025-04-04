// search-results.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchService, SearchItem, SearchResult } from '../services/search-service.service';
import { switchMap, tap } from 'rxjs/operators';
@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container mx-auto px-4 py-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold mb-2">Search Results for "{{ searchQuery }}"</h1>
        <p *ngIf="totalResults > 0" class="text-gray-500">{{ totalResults }} results found</p>
        <p *ngIf="totalResults === 0" class="text-gray-500">No results found</p>
      </div>
      
      <div class="flex space-x-4 mb-6">
        <button 
          (click)="filterResults('all')" 
          [class.bg-indigo-600]="currentFilter === 'all'"
          class="px-4 py-2 rounded-full bg-gray-800 hover:bg-indigo-600 transition-colors">
          All
        </button>
        <button 
          (click)="filterResults('movie')" 
          [class.bg-indigo-600]="currentFilter === 'movie'"
          class="px-4 py-2 rounded-full bg-gray-800 hover:bg-indigo-600 transition-colors">
          Movies
        </button>
        <button 
          (click)="filterResults('tv')" 
          [class.bg-indigo-600]="currentFilter === 'tv'"
          class="px-4 py-2 rounded-full bg-gray-800 hover:bg-indigo-600 transition-colors">
          TV Shows
        </button>
      </div>
      
      <div *ngIf="loading" class="flex justify-center py-10">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
      
      <div *ngIf="!loading && filteredResults.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <div *ngFor="let item of filteredResults" class="bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer hover:shadow-2xl transition-shadow" (click)="navigateToItem(item)">
          <div class="relative pb-2/3">
            <img 
              *ngIf="item.poster_path" 
              [src]="'https://image.tmdb.org/t/p/w500' + item.poster_path" 
              [alt]="item.title || item.name"
              class="absolute h-full w-full object-cover"
            >
            <div *ngIf="!item.poster_path" class="absolute h-full w-full bg-gray-700 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div class="p-4">
            <div class="flex justify-between items-start mb-1">
              <h2 class="text-lg font-medium truncate">{{ item.title || item.name }}</h2>
              <span class="bg-gray-700 text-gray-300 px-2 py-1 text-xs rounded-full">
                {{ item.media_type === 'movie' ? 'Movie' : 'TV' }}
              </span>
            </div>
            <p class="text-gray-400 text-sm mb-2">{{ item.release_date || item.first_air_date | slice:0:4 }}</p>
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span class="ml-1 text-sm">{{ item.vote_average.toFixed(1) }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div *ngIf="!loading && filteredResults.length === 0 && searchQuery" class="bg-gray-800 rounded-lg p-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h3 class="text-xl font-medium mb-2">No results found</h3>
        <p class="text-gray-400">Try searching for something else</p>
      </div>
      
      <!-- Pagination -->
      <div *ngIf="totalPages > 1" class="flex justify-center space-x-2 mt-8">
        <button 
          [disabled]="currentPage === 1"
          (click)="changePage(currentPage - 1)"
          [class.opacity-50]="currentPage === 1"
          class="px-4 py-2 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors">
          Previous
        </button>
        <div class="flex space-x-1">
          <button 
            *ngFor="let page of getPageNumbers()"
            (click)="changePage(page)"
            [class.bg-indigo-600]="page === currentPage"
            class="px-4 py-2 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors">
            {{ page }}
          </button>
        </div>
        <button 
          [disabled]="currentPage === totalPages"
          (click)="changePage(currentPage + 1)"
          [class.opacity-50]="currentPage === totalPages"
          class="px-4 py-2 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors">
          Next
        </button>
      </div>
    </div>
  `,
  styles: [`
   
  `]
})
export class SearchResultsComponent implements OnInit {
  searchQuery: string = '';
  currentPage: number = 1;
  totalPages: number = 0;
  totalResults: number = 0;
  searchResults: SearchItem[] = [];
  filteredResults: SearchItem[] = [];
  currentFilter: 'all' | 'movie' | 'tv' = 'all';
  loading: boolean = false;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private searchService: SearchService
  ) {}
  
  ngOnInit(): void {
    this.route.queryParams.pipe(
      switchMap(params => {
        this.searchQuery = params['query'] || '';
        this.currentPage = +params['page'] || 1;
        this.currentFilter = params['filter'] as any || 'all';
        
        if (!this.searchQuery) {
          return [];
        }
        
        this.loading = true;
        return this.searchService.search(this.searchQuery, this.currentPage);
      })
    ).subscribe({
      next: (results: any) => {
        if (results.results) {
          this.searchResults = results.results;
          this.totalPages = results.total_pages;
          this.totalResults = results.total_results;
          this.applyFilter();
        } else {
          this.searchResults = [];
          this.filteredResults = [];
          this.totalPages = 0;
          this.totalResults = 0;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.searchResults = [];
        this.filteredResults = [];
      }
    });
  }
  
  applyFilter(): void {
    if (this.currentFilter === 'all') {
      this.filteredResults = this.searchResults;
    } else {
      this.filteredResults = this.searchResults.filter(item => item.media_type === this.currentFilter);
    }
  }
  
  filterResults(filter: 'all' | 'movie' | 'tv'): void {
    this.currentFilter = filter;
    this.applyFilter();
    this.updateQueryParams();
  }
  
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.updateQueryParams();
    }
  }
  
  updateQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        query: this.searchQuery,
        page: this.currentPage,
        filter: this.currentFilter
      },
      queryParamsHandling: 'merge'
    });
  }
  
  navigateToItem(item: SearchItem): void {
    if (item.media_type === 'movie') {
      this.router.navigate(['/movie-details', item.id]);
    } else if (item.media_type === 'tv') {
      this.router.navigate(['/tv-shows', item.id]);
    }
  }
  
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPages = 5;
    
    if (this.totalPages <= maxPages) {
      // If there are less than or equal to maxPages, show all
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include first page, current page, and last page
      const hasFirstPage = pages.includes(1);
      const hasLastPage = pages.includes(this.totalPages);
      
      // Add current page and adjacent pages
      for (let i = Math.max(1, this.currentPage - 1); i <= Math.min(this.totalPages, this.currentPage + 1); i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }
      
      // Add first page if not already included
      if (!hasFirstPage) {
        pages.unshift(1);
      }
      
      // Add last page if not already included
      if (!hasLastPage) {
        pages.push(this.totalPages);
      }
    }
    
    return pages.sort((a, b) => a - b);
  }
}