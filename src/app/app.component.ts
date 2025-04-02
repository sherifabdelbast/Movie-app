import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MovieDetailsComponent } from "./movie-details/movie-details.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MovieDetailsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'movie-app';
}
