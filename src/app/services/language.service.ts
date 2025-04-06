import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private languageSubject = new BehaviorSubject<string>('en');
  language$ = this.languageSubject.asObservable();

  switchLanguage(lang: string) {
    this.languageSubject.next(lang);
  }

  getCurrentLanguage(): string {
    return this.languageSubject.value;
  }
}