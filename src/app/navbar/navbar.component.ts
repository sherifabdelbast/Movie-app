// navbar.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SearchComponent } from '../search/search.component';
import { WatchlistService } from '../services/watchlist.service';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, SearchComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  
  mobileMenuOpen = false;
  favoritesCount: number = 0;
  
  constructor(private watchlistService: WatchlistService,
    private languageService: LanguageService
  ) {}
  
  ngOnInit(): void {
    this.watchlistService.favoritesCount$.subscribe(count => {
      this.favoritesCount = count;
    });
  }
  onLanguageChange(event: Event) {
    const lang = (event.target as HTMLSelectElement).value;
    this.languageService.switchLanguage(lang);
  }
  
  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
}