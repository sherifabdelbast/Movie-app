import { Routes } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import { MovieListComponent } from "./movie-list/movie-list.component";
import { RegisterComponent } from "./register/register.component";
import { MovieListPaginationComponent } from "./movie-list-pagination/movie-list-pagination.component";
import { MovieDetailsComponent } from "./movie-details/movie-details.component";
import { WatchListComponent } from './watch-list/watch-list.component';
export const routes: Routes = [

{
  path: "",
  component : MovieListComponent,
  title : "Home"
},
{
  path: "login",
  component : LoginComponent,
  title : "Login"
},
{
  path: "register",
  component : RegisterComponent,
  title : "Register"
},
{
  path: "movies",
  component : MovieListPaginationComponent,
  title : "Movies"
},
{
  path: "movie-details/:id",
  component: MovieDetailsComponent,
  title: "Movie details"
},
{path: 'watchlist', 
  component: WatchListComponent,
  title: "Watchlist"
}
];
