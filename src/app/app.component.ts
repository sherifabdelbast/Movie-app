import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent  } from './footer/footer.component';
import { WatchListComponent} from './watch-list/watch-list.component';

@Component({
  selector: 'app-root',
  imports: [FooterComponent , RouterOutlet ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'movie-app';
}
