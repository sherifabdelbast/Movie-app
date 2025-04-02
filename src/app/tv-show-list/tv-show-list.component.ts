// tv-show-list.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { TvCardComponent } from '../tv-card/tv-card.component';
import { TvShowService } from '../services/tv-show.service';
import { TvShow } from '../models/tvshow.interface';

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
  tvShowService = inject(TvShowService);

  ngOnInit() {
    this.tvShowService.getPopularTvShows().subscribe(response => {
      this.allShows = response.results;
      this.tvShows = [...this.allShows];
    });
  }

  filterShows(range: 'today' | 'week' | 'all') {
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
}