import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <section class="bg-blue-600 text-white py-16 md:py-24">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-6">Emergency Response System</h1>
          <p class="text-xl md:text-2xl text-blue-100 mb-8">
            Real-time disaster management and community support platform for enhanced emergency response and recovery
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button mat-raised-button color="primary" class="custom-btn">
              Get Started
              <mat-icon class="ml-2">arrow_forward</mat-icon>
            </button>
            <button mat-stroked-button color="primary" class="learn-more-btn">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .custom-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      color: blue ;
    }

    .learn-more-btn {
      color: white !important;
      border: 1px solid white !important;
      transition: background-color 0.3s ease;
    }

    .learn-more-btn:hover {
      background-color: rgba(255, 255, 255, 0.2) !important;
    }
  `]
})
export class HomeComponent {}
