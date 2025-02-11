import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-incident-reporting',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, RouterModule],
  template: `
    <section class="py-20 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <mat-card class="p-8">
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0">
                <mat-icon class="text-red-500" fontIcon="warning" style="font-size: 2rem;"></mat-icon>
              </div>
              <div class="flex-grow">
                <h2 class="text-2xl font-bold mb-4">Report an Incident</h2>
                <p class="text-gray-600 mb-6">
                  Quickly report emergencies and incidents through our dynamic reporting system. Your reports help us
                  coordinate effective responses and keep communities informed.
                </p>
                <div class="flex flex-col sm:flex-row gap-4">
                  <button mat-raised-button color="warn" class="flex-1" [routerLink]="'/report'">
                    Report Emergency
                  </button>
                  <button mat-stroked-button color="primary" class="flex-1" [routerLink]="'/incidents'">
                    View Active Incidents
                  </button>
                </div>
              </div>
            </div>
          </mat-card>
        </div>
      </div>
    </section>
  `
})
export class IncidentReportingComponent {}
