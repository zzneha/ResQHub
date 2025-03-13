import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SubscriptionService } from '../services/subscription.service';

@Component({
  selector: 'app-email-subscription',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="subscription-container">
      <form (ngSubmit)="onSubmit()" class="subscription-form">
        <div class="input-group">
          <input 
            type="email" 
            [(ngModel)]="email"
            name="email"
            placeholder="Enter your email"
            required
            class="subscription-input"
          >
          <button 
            type="submit" 
            class="subscribe-button"
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
  `,
  styles: [`
    .subscription-container {
      width: 100%;
      max-width: 500px;
      margin: 0 auto;
      padding: 1rem;
    }

    .subscription-form {
      width: 100%;
    }

    .input-group {
      display: flex;
      gap: 0.5rem;
    }

    .subscription-input {
      flex: 1;
      padding: 0.75rem 1rem;
      border: 1px solid rgba(34, 153, 84, 0.2);
      border-radius: 4px;
      font-size: 1rem;
      color: #333;
      background: white;
    }

    .subscription-input:focus {
      outline: none;
      border-color: #229954;
      box-shadow: 0 0 0 2px rgba(34, 153, 84, 0.1);
    }

    .subscribe-button {
      padding: 0.75rem 1.5rem;
      background: #229954;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .subscribe-button:hover:not(:disabled) {
      background: #1a7441;
      transform: translateY(-1px);
    }

    .subscribe-button:disabled {
      background: #cccccc;
      cursor: not-allowed;
    }

    .error-message {
      color: #e74c3c;
      margin-top: 0.5rem;
      font-size: 0.875rem;
      text-align: center;
    }

    .success-message {
      color: #229954;
      margin-top: 0.5rem;
      font-size: 0.875rem;
      text-align: center;
    }

    @media (max-width: 480px) {
      .input-group {
        flex-direction: column;
      }

      .subscribe-button {
        width: 100%;
      }
    }
  `]
})
export class EmailSubscriptionComponent {
  email = '';
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private subscriptionService: SubscriptionService) {}

  async onSubmit() {
    if (!this.email) {
      this.errorMessage = 'Please enter your email address';
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
} 