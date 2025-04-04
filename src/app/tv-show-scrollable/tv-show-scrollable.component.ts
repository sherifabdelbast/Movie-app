import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TvCardComponent } from '../tv-card/tv-card.component';
import { TvShowService } from '../services/tv-show.service';
import { TvShow } from '../models/tvshow.interface';

@Component({
  selector: 'app-tv-show-scrollable',
  standalone: true,
  imports: [CommonModule, TvCardComponent],
  templateUrl: './tv-show-scrollable.component.html',
  styleUrl: './tv-show-scrollable.component.css'
})
export class TvShowScrollableComponent {
  tvShows: TvShow[] = [];
  tvShowsService = inject(TvShowService);

  ngOnInit() {
    this.tvShowsService.getPopularTvShows().subscribe((response: any) => {
      this.tvShows = response.results;
    });
  }
}