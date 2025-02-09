import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-emergency-contacts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto p-4">
      <h2 class="text-2xl font-bold mb-4">Emergency Contacts</h2>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        @for (contact of contacts; track contact.id) {
          <div class="border rounded-lg p-4 bg-white">
            <h3 class="text-xl font-semibold">{{ contact.name }}</h3>
            <p class="text-gray-600">{{ contact.description }}</p>
            <div class="mt-4">
              <a 
                [href]="'tel:' + contact.phone" 
                class="bg-red-600 text-white px-4 py-2 rounded inline-block hover:bg-red-700"
              >
                {{ contact.phone }}
              </a>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class EmergencyContactsComponent {
  contacts = [
    {
      id: 1,
      name: 'Emergency Services',
      description: 'Police, Fire, Ambulance',
      phone: '911'
    },
    {
      id: 2,
      name: 'Disaster Response Hotline',
      description: '24/7 Emergency Assistance',
      phone: '1-800-123-4567'
    },
    {
      id: 3,
      name: 'Medical Support',
      description: 'Emergency Medical Services',
      phone: '1-800-555-0000'
    }
  ];
}