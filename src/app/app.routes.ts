import { Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { MovieListComponent } from './movie-list/movie-list.component';
import { RegisterComponent } from './register/register.component';
import { MovieListPaginationComponent } from './movie-list-pagination/movie-list-pagination.component';
import { MovieDetailsComponent } from './movie-details/movie-details.component';
import { TvCardComponent } from './tv-card/tv-card.component';
import { TvShowListComponent } from './tv-show-list/tv-show-list.component';
import { TvShowDetailsComponent } from './tv-show-details/tv-show-details.component';
import { WatchListComponent } from './watch-list/watch-list.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  {
    path: 'tv-shows',
    children: [
      { path: '', component: TvShowListComponent }, // القائمة الرئيسية
      { path: ':id', component: TvShowDetailsComponent }, // التفاصيل
    ],
  },
 
  { path: 'watchlist', component: WatchListComponent },

  {
    path: '',
    component: HomeComponent,
    title: 'Home',
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Register',
  },
  {
    path: 'movies',
    component: MovieListPaginationComponent,
    title: 'Movies',
  },
  {
    path: 'movie-details/:id',
    component: MovieDetailsComponent,
    title: 'Movie details',
  },
];
