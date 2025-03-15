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
    <div class="register-container">
      <div class="register-background">
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
          <h1>Join ResQHub</h1>
          <p class="tagline">Become a volunteer and help make a difference in your community during times of crisis</p>
        </div>

        <div class="register-card glass">
          <h2>Volunteer Registration</h2>
          
          <form class="register-form" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <div class="input-wrapper">
                <span class="input-icon">👤</span>
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
                <span class="input-icon">📧</span>
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
                <span class="input-icon">📱</span>
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
    .register-container {
      min-height: 100vh;
      position: relative;
      display: flex;
      background: linear-gradient(135deg, #229954 0%, #27ae60 100%);
    }

    .register-background {
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
      background: #229954;
      transform: rotate(-15deg);
    }

    .satellite {
      position: absolute;
      top: 20%;
      right: 15%;
      width: 60px;
      height: 40px;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%23fff" d="M21 8.5c0-.83-.67-1.5-1.5-1.5S18 7.67 18 8.5s.67 1.5 1.5 1.5S21 9.33 21 8.5zM4.5 8C3.67 8 3 8.67 3 9.5S3.67 11 4.5 11 6 10.33 6 9.5 5.33 8 4.5 8zm9-2.5c0-.83-.67-1.5-1.5-1.5S11 4.67 11 5.5 11.67 7 12.5 7 13.5 6.33 13.5 5.5z"/></svg>');
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
      gap: 4rem;
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

    .register-card {
      width: 500px;
      padding: 2rem;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .register-card h2 {
      text-align: center;
      font-size: 1.75rem;
      margin-bottom: 2rem;
      color: white;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-label {
      display: block;
      margin-bottom: 0.5rem;
      color: white;
      font-weight: 500;
    }

    .input-wrapper {
      position: relative;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .input-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      font-size: 1.25rem;
    }

    .form-input {
      width: 100%;
      padding: 1rem 3rem;
      border: none;
      background: transparent;
      color: white;
      font-size: 1rem;
      caret-color: #229954;
    }

    textarea.form-input {
      padding: 1rem;
      min-height: 100px;
      resize: vertical;
    }

    .form-input::placeholder {
      color: rgba(255, 255, 255, 0.6);
    }

    .form-input:focus {
      outline: none;
      box-shadow: 0 0 0 2px rgba(34, 153, 84, 0.3);
      border-color: rgba(34, 153, 84, 0.5);
    }

    .toggle-password {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 0;
      font-size: 1.25rem;
    }

    .error-message {
      color: #e74c3c;
      margin-bottom: 1rem;
      text-align: center;
      padding: 0.75rem;
      background: rgba(231, 76, 60, 0.1);
      border-radius: 8px;
      border: 1px solid rgba(231, 76, 60, 0.2);
    }

    .success-message {
      color: #229954;
      margin-bottom: 1rem;
      text-align: center;
      padding: 0.75rem;
      background: rgba(34, 153, 84, 0.1);
      border-radius: 8px;
      border: 1px solid rgba(34, 153, 84, 0.2);
    }

    .btn-primary {
      width: 100%;
      padding: 1rem;
      background: #229954;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-primary:hover {
      background: #1a7441;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(34, 153, 84, 0.2);
    }

    .btn-primary:disabled {
      background: #cccccc;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .auth-footer {
      text-align: center;
      color: white;
      margin-top: 1.5rem;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .auth-footer p {
      margin: 0;
      margin-bottom: 0.5rem;
    }

    .auth-footer .link-primary {
      color: #229954;
      background: rgba(255, 255, 255, 0.9);
      padding: 0.25rem 1rem;
      border-radius: 4px;
      transition: all 0.3s ease;
    }

    .auth-footer .link-primary:hover {
      background: white;
      text-decoration: none;
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(34, 153, 84, 0.2);
    }

    .privacy-policy {
      text-align: center;
      margin-top: 1.5rem;
      color: rgba(255, 255, 255, 0.8);
    }

    .privacy-policy a {
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .privacy-policy a:hover {
      color: white;
    }

    .privacy-policy .separator {
      margin: 0 0.5rem;
      color: rgba(255, 255, 255, 0.4);
    }

    @media (max-width: 768px) {
      .content-wrapper {
        flex-direction: column;
        text-align: center;
        padding: 1rem;
        gap: 2rem;
      }

      .register-card {
        width: 100%;
        max-width: 500px;
      }

      .branding {
        max-width: 100%;
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