import { Component , inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormBuilder, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  FormBuilder = inject(FormBuilder)
  constructor(){
    this.registerForm = this.FormBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', [Validators.required, Validators.minLength(6)]]
    },
    { validators: this.passwordMatchValidator }
  );
    
    }
    handleSubmit() {
      if (this.registerForm.valid) {
        console.log('Form Data:', this.registerForm.value);
      }
    }
    passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
      const password = group.get('password')?.value;
      const confirmPassword = group.get('confirm_password')?.value;
      return password === confirmPassword ? null : { passwordMismatch: true };
    }
    hasPasswordMismatchError(): boolean {
      return this.registerForm.errors?.['passwordMismatch'] && 
            this.registerForm.get('confirm_password')?.touched;
    }
}
