import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VolunteerService } from '../../services/volunteer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-background">
        <div class="animated-scene">
          <div class="satellite"></div>
          <div class="truck truck-1"></div>
          <div class="truck truck-2"></div>
          <div class="factory"></div>
          <div class="houses"></div>
          <div class="earth"></div>
        </div>
      </div>

      <div class="content-wrapper">
        <div class="branding">
          <h1>ResQHub</h1>
          <p class="tagline">Join our community of dedicated volunteers making a difference in emergency response</p>
        </div>

        <div class="login-card glass">
          <h2>Volunteer Registration</h2>
          
          <form class="login-form" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <div class="input-wrapper">
                <i class="input-icon fas fa-user"></i>
                <input 
                  type="text" 
                  class="form-input"
                  [(ngModel)]="formData.fullName"
                  name="fullName"
                  placeholder="Enter your full name"
                  required>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Email</label>
              <div class="input-wrapper">
                <i class="input-icon fas fa-envelope"></i>
                <input 
                  type="email" 
                  class="form-input"
                  [(ngModel)]="formData.email"
                  name="email"
                  placeholder="Enter your email"
                  required>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Phone</label>
              <div class="input-wrapper">
                <i class="input-icon fas fa-phone"></i>
                <input 
                  type="tel" 
                  class="form-input"
                  [(ngModel)]="formData.phone"
                  name="phone"
                  placeholder="Enter your phone number"
                  required>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Why do you want to volunteer?</label>
              <div class="input-wrapper">
                <i class="input-icon fas fa-heart"></i>
                <textarea 
                  class="form-input"
                  [(ngModel)]="formData.reason"
                  name="reason"
                  rows="3"
                  placeholder="Tell us about your motivation"
                  required></textarea>
              </div>
            </div>

            <div *ngIf="errorMessage" class="error-message">
              {{ errorMessage }}
            </div>

            <div *ngIf="successMessage" class="success-message">
              {{ successMessage }}
            </div>

            <button type="submit" class="btn btn-primary w-full" [disabled]="isLoading">
              {{ isLoading ? 'Submitting...' : 'REGISTER AS VOLUNTEER' }}
            </button>

            <div class="auth-footer">
              <p>Already registered?</p>
              <a routerLink="/login" class="link-primary">Login here</a>
            </div>

            <div class="privacy-policy">
              <a routerLink="/privacy-policy">Privacy Policy</a>
              <span class="separator">•</span>
              <a routerLink="/terms">Terms of Service</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      position: relative;
      display: flex;
      background: linear-gradient(135deg, #229954 0%, #27ae60 100%);
    }

    .login-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    .animated-scene {
      position: relative;
      width: 100%;
      height: 100%;
    }

    .earth {
      position: absolute;
      bottom: -40%;
      left: -10%;
      width: 120%;
      height: 120%;
      border-radius: 50%;
      background: #1a7441;
      transform: rotate(-15deg);
    }

    .satellite {
      position: absolute;
      top: 20%;
      right: 15%;
      width: 60px;
      height: 40px;
      background: #fff;
      border-radius: 8px;
      animation: float 20s infinite linear;
    }

    .truck {
      position: absolute;
      width: 80px;
      height: 40px;
      background: #f1c40f;
      border-radius: 8px;
    }

    .truck-1 {
      bottom: 25%;
      left: 20%;
      animation: drive 15s infinite linear;
    }

    .truck-2 {
      bottom: 30%;
      left: 40%;
      animation: drive 12s infinite linear reverse;
    }

    .factory {
      position: absolute;
      bottom: 22%;
      right: 15%;
      width: 120px;
      height: 80px;
      background: #34495e;
    }

    .houses {
      position: absolute;
      bottom: 20%;
      left: 10%;
      width: 200px;
      height: 60px;
      background: #95a5a6;
    }

    @keyframes float {
      from { transform: translate(0, 0) rotate(0deg); }
      to { transform: translate(20px, -20px) rotate(360deg); }
    }

    @keyframes drive {
      from { transform: translateX(-100%); }
      to { transform: translateX(100vw); }
    }

    .content-wrapper {
      position: relative;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .branding {
      color: white;
      max-width: 400px;
    }

    .branding h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
      font-weight: 700;
    }

    .tagline {
      font-size: 1.25rem;
      line-height: 1.6;
      opacity: 0.9;
    }

    .login-card {
      width: 450px;
      padding: 2rem;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1),
                  0 2px 8px rgba(34, 153, 84, 0.1);
    }

    .login-card h2 {
      text-align: center;
      font-size: 1.75rem;
      margin-bottom: 2rem;
      color: #229954;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-label {
      display: block;
      margin-bottom: 0.5rem;
      color: #34495e;
      font-weight: 600;
      font-size: 0.9rem;
      letter-spacing: 0.5px;
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: flex-start;
      transition: all 0.3s ease;
    }

    .input-icon {
      position: absolute;
      left: 1rem;
      top: 0.75rem;
      font-size: 1.1rem;
      color: #229954;
      opacity: 0.8;
      transition: all 0.3s ease;
    }

    .input-wrapper:focus-within .input-icon {
      opacity: 1;
      color: #229954;
    }

    .form-input {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 3rem;
      border: 2px solid rgba(34, 153, 84, 0.1);
      border-radius: 12px;
      font-size: 1rem;
      background: rgba(255, 255, 255, 0.95);
      color: #2c3e50;
      transition: all 0.3s ease;
      caret-color: #229954;
      cursor: text;
    }

    .form-input::placeholder {
      color: #95a5a6;
    }

    .form-input:hover {
      border-color: rgba(34, 153, 84, 0.3);
      background: rgba(255, 255, 255, 1);
    }

    .form-input:focus {
      outline: none;
      border-color: #229954;
      background: #ffffff;
      box-shadow: 0 0 0 4px rgba(34, 153, 84, 0.1);
    }

    textarea.form-input {
      min-height: 100px;
      resize: vertical;
      line-height: 1.5;
      padding-top: 1rem;
      padding-left: 3rem;
    }

    .btn {
      width: 100%;
      padding: 0.75rem;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background: #229954;
      color: white;
      border: none;
      transform: translateY(0);
      transition: all 0.3s ease;
    }

    .btn-primary:hover {
      background: #1a7441;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(34, 153, 84, 0.2);
    }

    .btn-primary:active {
      transform: translateY(0);
    }

    .btn:disabled {
      background: #95a5a6;
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .error-message {
      color: #e74c3c;
      text-align: center;
      margin: 1rem 0;
      font-size: 0.875rem;
    }

    .success-message {
      color: #229954;
      text-align: center;
      margin: 1rem 0;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .auth-footer {
      margin-top: 1.5rem;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      background: rgba(26, 116, 65, 0.2);
      padding: 0.75rem;
      border-radius: 8px;
    }

    .auth-footer p {
      color: #ffffff;
      font-weight: 500;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    .link-primary {
      color: #ffffff;
      text-decoration: none;
      font-weight: 600;
      padding: 0.25rem 0.75rem;
      border-radius: 6px;
      background: rgba(34, 153, 84, 0.3);
      transition: all 0.3s ease;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    .link-primary:hover {
      text-decoration: none;
      background: rgba(34, 153, 84, 0.4);
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .privacy-policy {
      margin-top: 1rem;
      text-align: center;
    }

    .privacy-policy a {
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      font-size: 0.875rem;
      transition: all 0.3s ease;
    }

    .privacy-policy a:hover {
      color: rgba(255, 255, 255, 0.9);
    }

    .separator {
      color: rgba(255, 255, 255, 0.4);
      margin: 0 0.5rem;
    }

    @media (max-width: 768px) {
      .content-wrapper {
        flex-direction: column;
        padding: 1rem;
      }

      .branding {
        text-align: center;
        margin-bottom: 2rem;
      }

      .login-card {
        width: 100%;
      }
    }
  `]
})
export class RegisterComponent {
  formData = {
    fullName: '',
    email: '',
    phone: '',
    reason: ''
  };
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private volunteerService: VolunteerService, private router: Router) {}

  async onSubmit() {
    if (!this.formData.fullName || !this.formData.email || !this.formData.phone || !this.formData.reason) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      await this.volunteerService.registerVolunteer(this.formData);
      this.successMessage = "We'll contact you soon via email";
      // Reset form after successful submission
      this.formData = {
        fullName: '',
        email: '',
        phone: '',
        reason: ''
      };
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    } catch (error: any) {
      this.errorMessage = error.message || 'Failed to register. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }
}