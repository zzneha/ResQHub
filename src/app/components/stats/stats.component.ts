import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCardModule],
  template: `
    <section class="py-12 bg-blue-50">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <mat-card *ngFor="let stat of stats" class="p-6 rounded-lg shadow-sm text-center">
            <div class="inline-flex items-center justify-center w-12 h-12 mb-4 bg-blue-100 text-blue-600 rounded-full">
              <mat-icon class="mat-icon-large">{{ stat.icon }}</mat-icon>
            </div>
            <div class="text-3xl font-bold text-gray-900 mb-2">{{ stat.value }}</div>
            <div class="text-sm text-gray-600">{{ stat.label }}</div>
          </mat-card>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .mat-icon-large {
      font-size: 36px;
    }
  `]
})
export class StatsComponent {
  stats = [
    { icon: 'group', label: 'Active Volunteers', value: '157' },
    { icon: 'home', label: 'Available Shelters', value: '3' },
    { icon: 'notifications', label: 'Alerts Today', value: '12' },
    { icon: 'check_circle', label: 'People Helped', value: '1,234' },
  ];
}
