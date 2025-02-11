import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink ,RouterModule, CommonModule, MatButtonModule, MatIconModule],
  template: `
    <header class="bg-blue-600 text-white sticky top-0 z-50">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <a routerLink="/" class="flex items-center space-x-2">
            <mat-icon>shield</mat-icon>
            <span class="text-xl font-bold">ResQHub</span>
          </a>

          <nav class="hidden md:flex items-center space-x-8">
            <a routerLink="/" class="hover:text-blue-100">Home</a>
            <a routerLink="/training" class="hover:text-blue-100">Training</a>
            <a routerLink="/blog" class="hover:text-blue-100">Blog</a>
            <a routerLink="/find-shelter" class="hover:text-blue-100">Find Shelter</a>
          </nav>

          <div class="flex items-center space-x-4">
            <button mat-button class="report-button">Report Incident</button>
            <button routerLink="/login" mat-button class="login-button">Login</button>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .report-button {
      background-color: #D32F2F; /* Default red */
      color: white !important; /* Ensure text stays white */
      transition: background-color 0.3s ease;
    }
    .report-button:hover {
      background-color: #B71C1C; /* Darker red on hover */
      color: white !important; /* Keep text white */
    }

    .login-button {
      background-color: transparent;
      color: white !important; /* Ensure text stays white */
      border: 1px solid white;
      transition: background-color 0.3s ease, color 0.3s ease;
    }
    .login-button:hover {
      background-color: white;
      color: black !important; /* Change text color to black on hover */
    }
  `]
})
export class HeaderComponent {
  openReportModal() {
    // TODO: Implement modal opening logic
  }
}




  
