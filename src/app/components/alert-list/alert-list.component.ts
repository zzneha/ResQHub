import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Alert } from '../../models/alert.model';

@Component({
  selector: 'app-alert-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto p-4">
      <h2 class="text-2xl font-bold mb-4">Active Alerts</h2>
      <div class="grid gap-4">
        @for (alert of alerts; track alert.id) {
          <div class="border rounded-lg p-4" [ngClass]="{
            'bg-red-100': alert.severity === 'critical',
            'bg-orange-100': alert.severity === 'high',
            'bg-yellow-100': alert.severity === 'medium',
            'bg-blue-100': alert.severity === 'low'
          }">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-xl font-semibold">{{ alert.type | titlecase }}</h3>
                <p class="text-gray-600">{{ alert.location }}</p>
              </div>
              <span class="px-2 py-1 rounded text-sm" [ngClass]="{
                'bg-red-500 text-white': alert.severity === 'critical',
                'bg-orange-500 text-white': alert.severity === 'high',
                'bg-yellow-500': alert.severity === 'medium',
                'bg-blue-500 text-white': alert.severity === 'low'
              }">
                {{ alert.severity | uppercase }}
              </span>
            </div>
            <p class="mt-2">{{ alert.description }}</p>
            <p class="text-sm text-gray-500 mt-2">
              {{ alert.timestamp | date:'medium' }}
            </p>
          </div>
        }
      </div>
    </div>
  `
})
export class AlertListComponent {
  alerts: Alert[] = [
    {
      id: '1',
      type: 'hurricane',
      severity: 'critical',
      location: 'Coastal Region',
      description: 'Category 4 hurricane approaching. Immediate evacuation required.',
      timestamp: new Date()
    },
    {
      id: '2',
      type: 'flood',
      severity: 'high',
      location: 'River Valley',
      description: 'Flash flood warning. Seek higher ground immediately.',
      timestamp: new Date()
    }
  ];
}