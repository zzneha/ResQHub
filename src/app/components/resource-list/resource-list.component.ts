import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resource-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto p-4">
      <h2 class="text-2xl font-bold mb-4">Emergency Resources</h2>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        @for (resource of resources; track resource.id) {
          <div class="border rounded-lg p-4 hover:shadow-lg transition-shadow">
            <h3 class="text-xl font-semibold">{{ resource.name }}</h3>
            <p class="text-gray-600 mt-2">{{ resource.description }}</p>
            <div class="mt-4">
              <a 
                [href]="resource.link" 
                target="_blank" 
                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Learn More
              </a>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class ResourceListComponent {
  resources = [
    {
      id: 1,
      name: 'Emergency Kit Guide',
      description: 'Learn how to prepare an emergency kit for your family',
      link: '#'
    },
    {
      id: 2,
      name: 'Evacuation Routes',
      description: 'Find the nearest evacuation routes in your area',
      link: '#'
    },
    {
      id: 3,
      name: 'Shelter Locations',
      description: 'List of emergency shelters and their current status',
      link: '#'
    }
  ];
}