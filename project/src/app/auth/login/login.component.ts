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
              <label class="form-label">Username</label>
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

            <div class="auth-footer">
              <p>New volunteer?</p>
              <a routerLink="/register" class="link-primary">Register here</a>
            </div>

            <div class="privacy-policy">
              <a routerLink="/privacy-policy">Privacy Policy</a>
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
      width: 400px;
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
      font-weight: 600;
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
      align-items: center;
      transition: all 0.3s ease;
    }

    .input-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
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
      background: rgba(178, 182, 176, 0.95);
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

    .toggle-password {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      color: #229954;
      opacity: 0.7;
      transition: all 0.3s ease;
      padding: 0.5rem;
    }

    .toggle-password:hover {
      opacity: 1;
      color: #1a7441;
    }

    .form-actions {
      margin-top: 1.5rem;
    }

    .btn {
      cursor: pointer;
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
export class LoginComponent {
  email = '';
  password = '';
  isLoading = false;
  errorMessage = '';
  showPassword = false;

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
        this.router.navigate(['/dashboard']);
      }
    } catch (error: any) {
      this.errorMessage = error.message || 'Failed to login. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }
}