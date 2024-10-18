import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'ns-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  phoneNumber: string = '';
  verificationCode: string = '';
  isVerificationStep: boolean = false;

  constructor(private router: Router, private firebaseService: FirebaseService) {}

  async onRegister() {
    if (this.phoneNumber && this.phoneNumber.length >= 10) {
      try {
        await this.firebaseService.registerUser(this.phoneNumber);
        this.isVerificationStep = true;
      } catch (error) {
        console.error('Error registering user:', error);
        alert('An error occurred while registering. Please try again.');
      }
    } else {
      alert('Please enter a valid phone number');
    }
  }

  async onVerify() {
    if (this.verificationCode && this.verificationCode.length === 6) {
      try {
        await this.firebaseService.verifyPhoneNumber(this.verificationCode);
        // Navigation is handled by app.component.ts based on auth state
      } catch (error) {
        console.error('Error verifying code:', error);
        alert('Invalid verification code. Please try again.');
      }
    } else {
      alert('Please enter a valid verification code');
    }
  }
}