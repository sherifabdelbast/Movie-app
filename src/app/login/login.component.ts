import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  formBuilder = inject(FormBuilder);
  private router = inject(Router); // Using inject() for consistency

  constructor() {
    // Define the form with only email and password fields
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  handleSubmit() {
    if (this.loginForm.valid) {
      
      const { email, password } = this.loginForm.value;
      console.log('Login attempt with:', { email, password });

     

     
      this.router.navigate(['/']);
    } else {
      console.log('Form is invalid');
    }
  }
}