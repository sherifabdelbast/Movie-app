import { Component, Input, Output, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';
import { MovieInterface } from '../models/movie.interface';
@Component({
  selector: 'app-movie-card',
  imports: [],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.css'
})
export class MovieCardComponent {

  @Input() movieItem !: MovieInterface;
  @Output() sendToParent = new EventEmitter<number>();
  @Output() favorite = new EventEmitter<number>();

  constructor(private router: Router) {}

  moveToMovieDetails() {
    this.router.navigate(['/movie-details',this.movieItem.id]);
  }
  toggleFavorite(event: Event) {
    event.stopPropagation(); 
    this.favorite.emit(this.movieItem.id);
    console.log('Added to favorite:', this.movieItem.id);
  }


  addToWishlist(event: Event) {
    event.stopPropagation(); 
    console.log('Added to wishlist:', this.movieItem.id);
  }

}
