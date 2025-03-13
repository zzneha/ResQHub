import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-login',
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
          <p class="tagline">Progress is impossible without change, and those who cannot change their minds cannot change anything</p>
        </div>

        <div class="login-card glass">
          <h2>Log In</h2>
          
          <form class="login-form" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label class="form-label">Email</label>
              <div class="input-wrapper">
                <span class="input-icon">👤</span>
                <input 
                  type="email" 
                  class="form-input"
                  [(ngModel)]="email"
                  name="email"
                  placeholder="Enter your email"
                  required>
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label">Password</label>
              <div class="input-wrapper">
                <span class="input-icon">🔒</span>
                <input 
                  [type]="showPassword ? 'text' : 'password'" 
                  class="form-input"
                  [(ngModel)]="password"
                  name="password"
                  placeholder="Enter your password"
                  required>
                <button 
                  type="button" 
                  class="toggle-password"
                  (click)="showPassword = !showPassword">
                  {{ showPassword ? '👁️' : '👁️‍🗨️' }}
                </button>
              </div>
            </div>

            <div *ngIf="errorMessage" class="error-message">
              {{ errorMessage }}
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary w-full" [disabled]="isLoading">
                {{ isLoading ? 'Logging in...' : 'LOG IN' }}
              </button>
            </div>

            <div class="auth-links">
              <a routerLink="/forgot-password" class="link-primary">Forgot password?</a>
              <span class="divider">•</span>
              <a routerLink="/register" class="link-primary">Register as Volunteer</a>
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
      background: linear-gradient(135deg, #2ecc71, #27ae60);
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

    .login-card {
      width: 400px;
      padding: 2rem;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .login-card h2 {
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
    }

    .form-input::placeholder {
      color: rgba(255, 255, 255, 0.6);
    }

    .form-input:focus {
      outline: none;
      box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
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
      padding: 0.5rem;
      background: rgba(231, 76, 60, 0.1);
      border-radius: 4px;
    }

    .form-actions {
      margin-bottom: 1rem;
    }

    .auth-links {
      text-align: center;
      color: white;
    }

    .link-primary {
      color: white;
      text-decoration: none;
      font-weight: 500;
    }

    .link-primary:hover {
      text-decoration: underline;
    }

    .divider {
      margin: 0 0.5rem;
      opacity: 0.5;
    }

    @media (max-width: 1200px) {
      .content-wrapper {
        max-width: 1000px;
        gap: 3rem;
      }

      .branding h1 {
        font-size: 2.5rem;
      }
    }

    @media (max-width: 992px) {
      .content-wrapper {
        max-width: 800px;
        gap: 2rem;
      }

      .branding h1 {
        font-size: 2.25rem;
      }

      .tagline {
        font-size: 1.125rem;
      }

      .login-card {
        width: 350px;
      }
    }

    @media (max-width: 768px) {
      .content-wrapper {
        flex-direction: column;
        text-align: center;
        padding: 1.5rem;
        gap: 2rem;
        justify-content: center;
      }

      .login-card {
        width: 100%;
        max-width: 400px;
      }

      .branding {
        max-width: 100%;
      }

      .branding h1 {
        font-size: 2rem;
      }

      .animated-scene {
        opacity: 0.5;
      }
    }

    @media (max-width: 576px) {
      .content-wrapper {
        padding: 1rem;
      }

      .login-card {
        padding: 1.5rem;
      }

      .branding h1 {
        font-size: 1.75rem;
      }

      .tagline {
        font-size: 1rem;
      }

      .login-card h2 {
        font-size: 1.5rem;
        margin-bottom: 1.5rem;
      }

      .form-input {
        padding: 0.875rem 2.75rem;
        font-size: 0.9375rem;
      }

      .input-icon {
        font-size: 1.125rem;
        left: 0.875rem;
      }

      .toggle-password {
        right: 0.875rem;
        font-size: 1.125rem;
      }

      .auth-links {
        flex-direction: column;
        gap: 0.5rem;
      }

      .divider {
        display: none;
      }
    }

    @media (max-width: 360px) {
      .login-card {
        padding: 1.25rem;
      }

      .branding h1 {
        font-size: 1.5rem;
      }

      .login-card h2 {
        font-size: 1.25rem;
      }

      .form-input {
        padding: 0.75rem 2.5rem;
        font-size: 0.875rem;
      }
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  showPassword = false;
  isLoading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  async onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const user = await this.authService.login(this.email, this.password);
      if (user) {
        this.router.navigate(['/account']);
      }
    } catch (error: any) {
      this.errorMessage = error.message || 'Failed to login. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }
}


  

    

    
