import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { SubscriptionService } from '../services/subscription.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, FormsModule],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <!-- Brand Section -->
          <div class="brand-section">
            <a routerLink="/" class="brand-link">
              <mat-icon class="brand-icon">emergency</mat-icon>
              <span class="brand-name">ResQHub</span>
            </a>
            <p class="brand-description">Enhancing community resilience through effective disaster response and recovery.</p>
            <div class="social-links">
              <a href="#" class="social-link">
                <mat-icon>facebook</mat-icon>
              </a>
              <a href="#" class="social-link">
                <mat-icon>twitter</mat-icon>
              </a>
              <a href="#" class="social-link">
                <mat-icon>instagram</mat-icon>
              </a>
            </div>
          </div>

          <!-- Quick Links Section -->
          <div class="footer-section">
            <h3 class="footer-heading">Quick Links</h3>
            <ul class="footer-links">
              <li>
                <a routerLink="/about" class="footer-link">
                  <mat-icon class="link-icon">arrow_right</mat-icon>
                  <span>About Us</span>
                </a>
              </li>
              <li>
                <a routerLink="/forum" class="footer-link">
                  <mat-icon class="link-icon">arrow_right</mat-icon>
                  <span>Forum</span>
                </a>
              </li>
              <li>
                <a routerLink="/contact" class="footer-link">
                  <mat-icon class="link-icon">arrow_right</mat-icon>
                  <span>Contact Us</span>
                </a>
              </li>
            </ul>
          </div>

          <!-- Resources Section -->
          <div class="footer-section">
            <h3 class="footer-heading">Resources</h3>
            <ul class="footer-links">
              <li>
                <a routerLink="/training" class="footer-link">
                  <mat-icon class="link-icon">school</mat-icon>
                  <span>Training</span>
                </a>
              </li>
              <li>
                <a routerLink="/register" class="footer-link">
                  <mat-icon class="link-icon">volunteer_activism</mat-icon>
                  <span>Volunteer</span>
                </a>
              </li>
             
            </ul>
          </div>

          <!-- Emergency Section -->
          <div class="footer-section">
            <h3 class="footer-heading">Emergency</h3>
            <ul class="footer-links">
              <li>
                <a routerLink="/report" class="footer-link emergency-link">
                  <mat-icon class="emergency-icon">warning</mat-icon>
                  <span>Report Incident</span>
                </a>
              </li>
              <li>
                <a routerLink="/shelters" class="footer-link emergency-link">
                  <mat-icon class="emergency-icon">home</mat-icon>
                  <span>Find Shelter</span>
                </a>
              </li>
              <li>
                <a routerLink="/contacts" class="footer-link emergency-link">
                  <mat-icon class="emergency-icon">phone_in_talk</mat-icon>
                  <span>Emergency Contacts</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Newsletter Section -->
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


        <!-- Copyright Section -->
        <div class="copyright-section">
          <p class="copyright-text">&copy; {{ currentYear }} ResQHub. All rights reserved.</p>
        </div>
      
    </footer>

    <style>
      .footer {
        background: linear-gradient(to bottom, #1a1a1a, #000000);
        color: #cccccc;
        padding: 60px 0;
      }

      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
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
      background:rgb(131, 56, 35);
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    button:hover:not(:disabled) {
      background:rgb(229, 190, 147);
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
      color:rgb(206, 98, 67);
      font-size: 0.875rem;
      margin-top: 0.5rem;
    }


      .footer-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 40px;
      }

      .brand-section {
        margin-bottom: 30px;
      }

      .brand-link {
        display: flex;
        align-items: center;
        gap: 10px;
        text-decoration: none;
      }

      .brand-icon {
        color:rgb(153, 48, 34);
        transition: transform 0.3s;
      }

      .brand-name {
        font-size: 24px;
        font-weight: bold;
        color: white;
        transition: color 0.3s;
      }

      .brand-link:hover .brand-icon {
        transform: scale(1.1) rotate(12deg);
      }

      .brand-link:hover .brand-name {
        color:rgb(221, 184, 159);
      }

      .brand-description {
        color: #999;
        margin: 20px 0;
        line-height: 1.6;
      }

      .social-links {
        display: flex;
        gap: 20px;
        margin-top: 20px;
      }

      .social-link {
        color: #999;
        transition: color 0.3s, transform 0.3s;
      }

      .social-link:hover {
        color: white;
        transform: scale(1.1);
      }

      .footer-section {
        margin-bottom: 30px;
      }

      .footer-heading {
        color: white;
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 20px;
        position: relative;
        padding-bottom: 10px;
      }

      .footer-heading::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 40px;
        height: 2px;
        background-color:rgb(153, 60, 34);
      }

      .footer-links {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .footer-link {
        display: flex;
        align-items: center;
        gap: 10px;
        color: #999;
        text-decoration: none;
        margin-bottom: 15px;
        transition: color 0.3s;
      }

      .footer-link:hover {
        color: white;
      }

      .link-icon {
        font-size: 18px;
        transition: color 0.3s;
      }

      .footer-link:hover .link-icon {
        color:rgb(203, 149, 122);
      }

      .emergency-link {
        color: #999;
      }

      .emergency-icon {
        color:rgb(153, 60, 34);;
      }

      .emergency-link:hover {
        color:rgb(227, 107, 67);
      }

      .newsletter-section {
        border-top: 1px solid #333;
        margin-top: 40px;
        padding-top: 40px;
      }

      .newsletter-container {
        max-width: 500px;
        margin: 0 auto;
        text-align: center;
      }

      .newsletter-heading {
        color: white;
        font-size: 20px;
        margin-bottom: 20px;
      }

      .newsletter-form {
        display: flex;
        gap: 10px;
      }

      .newsletter-input {
        flex: 1;
        padding: 12px 16px;
        border-radius: 6px;
        border: 1px solid #333;
        background-color: rgba(51, 51, 51, 0.5);
        color: white;
        transition: all 0.3s;
      }

      .newsletter-input:focus {
        outline: none;
        border-color: #229954;
        box-shadow: 0 0 0 2px rgba(34, 153, 84, 0.2);
      }

      .newsletter-button {
        padding: 12px 24px;
        background-color:rgb(153, 60, 34);;
        color: white;
        border: none;
        border-radius: 6px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s;
      }

      .newsletter-button:hover {
        background-color:rgb(219, 166, 143);
        transform: scale(1.05);
      }

      .copyright-section {
        border-top: 1px solid #333;
        margin-top: 40px;
        padding-top: 20px;
        text-align: center;
      }

      .copyright-text {
        color: #666;
        font-size: 14px;
      }

      /* Responsive Design */
      @media (max-width: 768px) {
        .footer-grid {
          grid-template-columns: 1fr;
        }

        .footer-section {
          margin-top: 30px;
        }

        .newsletter-form {
          flex-direction: column;
        }

        .newsletter-button {
          width: 100%;
        }
      }
    </style>
  `
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