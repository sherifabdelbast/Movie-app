import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './toast/toast.component';
import { NavbarComponent } from './navbar/navbar.component';

import { FooterComponent} from './footer/footer.component';
import { ToastComponent } from './toast/toast.component';


@Component({
  selector: 'app-root',
  standalone: true,
imports: [FooterComponent, RouterOutlet, NavbarComponent, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'movie-app';
}