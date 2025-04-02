// tv-show-details.component.ts
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { TvShowService } from '../services/tv-show.service';
import { TvShow } from '../models/tvshow.interface';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-tv-show-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tv-show-details.component.html',
  styleUrls: ['./tv-show-details.component.css']
})
export class TvShowDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private tvShowService = inject(TvShowService);
  
  tvShow?: TvShow;
  isLoading = true;
  errorMessage?: string;

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.loadTvShowDetails(id);
    });
  }

  private loadTvShowDetails(id: string) {
    this.isLoading = true;
    this.tvShowService.getTvShowDetails(id).subscribe({
      next: (show) => {
        this.tvShow = show;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load TV show details';
        this.isLoading = false;
      }
    });
  }
}