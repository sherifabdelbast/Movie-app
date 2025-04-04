
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Toast, ToastService } from '../services/toastservice.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      @for (toast of toasts; track toast.id) {
        <div 
          [ngClass]="{
            'bg-green-600': toast.type === 'success',
            'bg-red-600': toast.type === 'error',
            'bg-blue-600': toast.type === 'info'
          }"
          class="text-white px-4 py-2 rounded-lg shadow-lg flex items-center justify-between min-w-64 animate-fadeIn"
        >
          <span>{{ toast.message }}</span>
          <button 
            class="ml-4 text-white/80 hover:text-white focus:outline-none"
            (click)="closeToast(toast.id)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn {
      animation: fadeIn 0.3s ease-out forwards;
    }
  `]
})
export class ToastComponent implements OnInit {
  toasts: Toast[] = [];
  
  constructor(private toastService: ToastService) {}
  
  ngOnInit(): void {
    this.toastService.toasts$.subscribe(toasts => {
      this.toasts = toasts;
    });
  }
  
  closeToast(id: number): void {
    this.toastService.remove(id);
  }
}