import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [RouterLink,CommonModule, MatIconModule, MatCardModule],
  template: `
    <section class="py-20">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold mb-4">Key Features</h2>
          <p class="text-gray-600 max-w-2xl mx-auto">
            Our platform integrates essential tools and resources to optimize disaster response and recovery efforts.
          </p>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <a *ngFor="let feature of features" [routerLink]="feature.link" class="feature-card">
            <mat-card class="p-6 rounded-lg border border-gray-200 transition-colors cursor-pointer">
              <div class="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 text-blue-600 mb-4">
                <mat-icon>{{ feature.icon }}</mat-icon>
              </div>
              <h3 class="text-xl font-semibold mb-2">{{ feature.title }}</h3>
              <p class="text-gray-600">{{ feature.description }}</p>
            </mat-card>
          </a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .feature-card {
      text-decoration: none;
      display: block;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .feature-card:hover mat-card {
      background-color: rgba(235, 225, 225, 0.1);
      transform: scale(1.02);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  `]
})
export class FeaturesComponent {
  features = [
    { icon: 'notifications', title: 'Emergency Alerts', description: 'Real-time notifications for disaster alerts, evacuation notices, and safety instructions.', link: '/alerts' },
    { icon: 'group', title: 'Volunteer Network', description: 'Connect with and coordinate volunteer efforts through our approval-based system.', link: '/volunteers' },
    { icon: 'menu_book', title: 'Training Hub', description: 'Access interactive learning modules and quizzes for disaster preparedness.', link: '/training' },
    { icon: 'favorite', title: 'Missing Persons', description: 'Help reconnect families through our missing person search module.', link: '/missing-persons' },
    { icon: 'place', title: 'Relief Camp Locator', description: 'Find nearby relief camps and check real-time resource availability.', link: '/relief-camps' },
    { icon: 'chat', title: 'Live Support', description: 'Get instant answers to common questions through our FAQ system.', link: '/support' },
  ];
}
