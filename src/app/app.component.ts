import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import { MovieListComponent } from "./movie-list/movie-list.component";
import { RegisterComponent } from "./register/register.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,
            LoginComponent,
            RegisterComponent, 
            MovieListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'movie-app';
}
