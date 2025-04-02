

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TvShow } from '../models/tvshow.interface';

@Component({
  selector: 'app-tv-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tv-card.component.html',
  styleUrl: './tv-card.component.css'
})
export class TvCardComponent {
  @Input() tvShow!: TvShow
  @Output() sendToParent = new EventEmitter<number>();
  
  constructor(private router: Router) {}
  
  moveToTvShowDetails() {
    this.router.navigate(['/tv-shows', this.tvShow.id]);
  }
  
  handleImageError(event: any) {
    if (event.target.src !== 'https://via.placeholder.com/500x750?text=No+Poster') {
      event.target.src = 'https://via.placeholder.com/500x750?text=No+Poster';
    }
  }

  formatDate(dateString: string | null): string {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.getFullYear().toString();
  }
}