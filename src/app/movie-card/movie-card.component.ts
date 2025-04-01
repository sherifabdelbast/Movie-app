import { Component, Input, Output, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-movie-card',
  imports: [],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.css'
})
export class MovieCardComponent {

  @Input() movieItem : any;
  @Output() sendToParent = new EventEmitter<number>();
  // deleteMovie() {
  //   console.log(this.movieItem.id);
  //   this.sendToParent.emit(this.movieItem.id);
  // }

  // moveToMovieDetails(movieId: number) {
  //   // Navigation logic
  // }

  // toggleWatchlist(movie: any) {
  //   // Watchlist logic
  // }
  // toggleWatchlist() {
  // // }
  // handleViewDetails(){

  // }
  constructor(private router: Router) {}

  // moveToMovieDetails() {
  //   this.router.navigate(['/movies', this.movieItem.id]);

  // }

}
