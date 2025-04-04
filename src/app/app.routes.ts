import { Routes } from '@angular/router';
import { TvCardComponent } from './tv-card/tv-card.component';
import { TvShowListComponent } from './tv-show-list/tv-show-list.component';
import { TvShowDetailsComponent } from './tv-show-details/tv-show-details.component';
import { WatchListComponent } from './watch-list/watch-list.component';


export const routes: Routes = [

  { 
    path: 'tv-shows',
    children: [
      { path: '', component: TvShowListComponent }, // القائمة الرئيسية
      { path: ':id', component: TvShowDetailsComponent } // التفاصيل
    ]
  },
  { path: '', redirectTo: '/tv-shows', pathMatch: 'full' },
  {path: 'watchlist', component: WatchListComponent},
  // إعادة التوجيه للصفحة الرئيسية
 
  // Add 404 route
  // { path: '**', component: NotFoundComponent }


];
