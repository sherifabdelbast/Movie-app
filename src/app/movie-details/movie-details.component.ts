import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MovieDetailsApiService } from './../services/movie-details-api.service';
import { forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.css',
})
export class MovieDetailsComponent implements OnInit {
  movieId: string = '';
  movieDetails: any = {};
  recommendations: any = { results: [] };
  reviews: any = { results: [] };
  credits: any = { cast: [], crew: [] };
  isLoading: boolean = true;
  releaseYear: string = '';

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieDetailsApiService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.movieId = params['id'];
      this.loadMovieData();
    });
  }

  loadMovieData(): void {
    this.isLoading = true;

    const creditsCall = this.http.get(
      `https://api.themoviedb.org/3/movie/${this.movieId}/credits?api_key=2fcc1a253fc8e132b7699c023f783b1f`
    );

    forkJoin({
      details: this.movieService.getMovieDetails(this.movieId),
      recommendations: this.movieService.getRecommendations(this.movieId),
      reviews: this.movieService.getReviews(this.movieId),
      credits: creditsCall,
    }).subscribe({
      next: (response) => {
        this.movieDetails = response.details;
        this.recommendations = response.recommendations;
        this.reviews = response.reviews;
        this.credits = response.credits;

        if (this.movieDetails.release_date) {
          this.releaseYear = new Date(this.movieDetails.release_date)
            .getFullYear()
            .toString();
        } else {
          this.releaseYear = '';
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching movie data:', error);
        this.isLoading = false;
      },
    });
  }

  getImageUrl(path: string): string {
    if (!path) return '/api/placeholder/300/450';
    return `https://image.tmdb.org/t/p/w500${path}`;
  }

  getBackdropUrl(path: string): string {
    if (!path) return '/api/placeholder/1200/600';
    return `https://image.tmdb.org/t/p/original${path}`;
  }

  getDirectors(): any[] {
    if (!this.credits || !this.credits.crew) return [];
    return this.credits.crew.filter((person: any) => person.job === 'Director');
  }

  getCreators(): any[] {
    if (!this.credits || !this.credits.crew) return [];
    return this.credits.crew
      .filter(
        (person: any) =>
          person.job === 'Creator' || person.job === 'Executive Producer'
      )
      .slice(0, 2);
  }

  getVotePercentage(vote: number): string {
    return Math.round(vote * 10).toString() + '%';
  }
}
