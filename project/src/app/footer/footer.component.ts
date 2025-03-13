import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SubscriptionService } from '../services/subscription.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="brand-section">
            <h2>ResQHub</h2>
            <p class="tagline">Empowering communities through coordinated disaster response</p>
          </div>

          <div class="quick-links">
            <h3>Quick Links</h3>
            <nav>
              <a routerLink="/home">Home</a>
              <a routerLink="/volunteer/dashboard">Dashboard</a>
              <a routerLink="/report">Report Incident</a>
              <a routerLink="/training">Training</a>
            </nav>
          </div>

          <div class="resources">
            <h3>Resources</h3>
            <nav>
              <a routerLink="/privacy-policy">Privacy Policy</a>
              <a routerLink="/terms">Terms of Service</a>
              <a routerLink="/contact">Contact Us</a>
              <a routerLink="/about">About Us</a>
            </nav>
          </div>

          <div class="newsletter">
            <h3>Stay Updated</h3>
            <p>Subscribe to our newsletter for updates and alerts</p>
            <form (ngSubmit)="onSubscribe()" class="subscribe-form">
              <div class="input-group">
                <input 
                  type="email" 
                  [(ngModel)]="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                  [class.error]="!!errorMessage"
                >
                <button 
                  type="submit" 
                  [disabled]="isLoading || !email">
                  {{ isLoading ? 'Subscribing...' : 'Subscribe' }}
                </button>
              </div>
              @if (errorMessage) {
                <div class="error-message">{{ errorMessage }}</div>
              }
              @if (successMessage) {
                <div class="success-message">{{ successMessage }}</div>
              }
            </form>
          </div>
        </div>

        <div class="footer-bottom">
          <p>&copy; {{ currentYear }} ResQHub. All rights reserved.</p>
          <div class="social-links">
            <a href="#" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="#" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="#" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background:rgb(0, 0, 0);
      color: white;
      padding: 4rem 0 2rem;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .footer-content {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .brand-section h2 {
      font-size: 1.75rem;
      margin-bottom: 1rem;
    }

    .tagline {
      opacity: 0.9;
      line-height: 1.6;
    }

    h3 {
      font-size: 1.25rem;
      margin-bottom: 1.25rem;
      font-weight: 600;
    }

    nav {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    nav a {
      color: rgba(255, 255, 255, 0.9);
      text-decoration: none;
      transition: color 0.3s ease;
    }

    nav a:hover {
      color: white;
    }

    .newsletter p {
      margin-bottom: 1rem;
      opacity: 0.9;
    }

    .subscribe-form {
      width: 100%;
    }

    .input-group {
      display: flex;
      gap: 0.5rem;
    }

    input {
      flex: 1;
      padding: 0.75rem 1rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      font-size: 0.875rem;
    }

    input::placeholder {
      color: rgba(255, 255, 255, 0.6);
    }

    input:focus {
      outline: none;
      border-color: rgba(255, 255, 255, 0.5);
    }

    input.error {
      border-color: #e74c3c;
    }

    button {
      padding: 0.75rem 1.5rem;
      background: #229954;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    button:hover:not(:disabled) {
      background: #27ae60;
      transform: translateY(-1px);
    }

    button:disabled {
      background: rgba(255, 255, 255, 0.2);
      cursor: not-allowed;
    }

    .error-message {
      color: #e74c3c;
      font-size: 0.875rem;
      margin-top: 0.5rem;
    }

    .success-message {
      color: #2ecc71;
      font-size: 0.875rem;
      margin-top: 0.5rem;
    }

    .footer-bottom {
      padding-top: 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .social-links {
      display: flex;
      gap: 1.5rem;
    }

    .social-links a {
      color: rgba(255, 255, 255, 0.9);
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .social-links a:hover {
      color: white;
    }

    @media (max-width: 992px) {
      .footer-content {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .footer {
        padding: 3rem 0 1.5rem;
      }

      .footer-content {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .input-group {
        flex-direction: column;
      }

      button {
        width: 100%;
      }

      .footer-bottom {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
      }
    }
  `]
})
export class FooterComponent {
  email = '';
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  currentYear = new Date().getFullYear();

  constructor(private subscriptionService: SubscriptionService) {}

  async onSubscribe() {
    if (!this.email) {
      this.errorMessage = 'Please enter your email address';
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      await this.subscriptionService.subscribe(this.email);
      this.successMessage = 'Thank you for subscribing! Please check your email for confirmation.';
      this.email = '';
    } catch (error: any) {
      this.errorMessage = error.message || 'Failed to subscribe. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
} 

