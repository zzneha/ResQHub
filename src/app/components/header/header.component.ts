import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <nav class="bg-blue-600 text-white shadow-lg">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-8">
            <a routerLink="/" class="text-2xl font-bold">ResQHub</a>
            <div class="hidden md:flex space-x-4">
              <a routerLink="/" class="hover:text-blue-200">Home</a>
              <a routerLink="/training" class="hover:text-blue-200">Training</a>
              <a routerLink="/blog" class="hover:text-blue-200">Blog</a>
              <a routerLink="/shelters" class="hover:text-blue-200">Find Shelter</a>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <button (click)="openReportModal()" class="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg">
              Report Incident
            </button>
            <a routerLink="/login" class="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg">
              Login
            </a>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class HeaderComponent {
  openReportModal() {
    // TODO: Implement modal opening logic
  }
}