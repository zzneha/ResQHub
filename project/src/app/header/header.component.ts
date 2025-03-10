import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ReportService } from '../services/report.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <header class="header glass">
      <div class="container header-content">
        <div class="logo">
          <a routerLink="/" class="logo-link">
            <svg viewBox="0 0 24 24" class="logo-icon">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v4.7c0 4.83-3.4 9.36-7 10.6-3.6-1.24-7-5.77-7-10.6V6.3l7-3.12z"/>
            </svg>
            <span>ResQHub</span>
          </a>
        </div>
        <nav class="nav-links">
          <a routerLink="/home" routerLinkActive="active" class="nav-link glass-hover">Home</a>
          <a routerLink="/training" routerLinkActive="active" class="nav-link glass-hover">Training</a>
          <a routerLink="/shelters" routerLinkActive="active" class="nav-link glass-hover">Find Shelter</a>
        </nav>
        <div class="action-buttons">
          <a *ngIf="isVolunteer" 
             routerLink="/report" 
             class="btn btn-primary glass-hover">Report</a>
          @if (isLoggedIn) {
            <div class="user-menu">
              <a routerLink="/account" class="btn btn-secondary glass-hover">Account</a>
              <button class="btn btn-secondary glass-hover" (click)="logout()">Logout</button>
            </div>
          } @else {
            <a routerLink="/login" class="btn btn-secondary glass-hover">Login</a>
          }
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      border-bottom: 1px solid var(--glass-border);
      position: sticky;
      top: 0;
      z-index: 100;
      color: white;
    }

    .header-content {
      height: 72px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .logo-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      color: var(--text-primary);
      font-family: 'Space Grotesk', sans-serif;
      font-weight: 600;
      font-size: 1.25rem;
    }

    .logo-icon {
      width: 28px;
      height: 28px;
      fill: var(--primary);
    }

    .nav-links {
      display: flex;
      gap: 2rem;
    }

    .nav-link {
      color: var(--text-secondary);
      text-decoration: none;
      font-weight: 500;
      position: relative;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .nav-link:hover,
    .nav-link.active {
      color: #229954;
      background: rgba(34, 153, 84, 0.1);
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
    }

    .user-menu {
      display: flex;
      gap: 0.5rem;
    }


    .btn-primary {
      background: #229954;
      color: white;
      border: none;
      transition: all 0.3s ease;
    }

    .btn-primary:hover {
      background: #1a7441;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(34, 153, 84, 0.2);
    }

    .btn-secondary {
      background: rgba(34, 153, 84, 0.1);
      color: #229954;
      border: 1px solid rgba(34, 153, 84, 0.2);
      transition: all 0.3s ease;
    }

    .btn-secondary:hover {
      background: rgba(34, 153, 84, 0.15);
      border-color: rgba(19, 246, 113, 0.3);
      transform: translateY(-1px);
    }
  `]
})
export class HeaderComponent implements OnInit {
  email = '';
  isLoggedIn = false;
  isVolunteer = false;

  constructor(
    private authService: AuthService,
    private reportService: ReportService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log('HeaderComponent initialized');
    this.authService.currentUser$.subscribe(user => {
      console.log('Auth state changed:', user ? 'User logged in' : 'No user');
      this.isLoggedIn = !!user;
      console.log('isLoggedIn set to:', this.isLoggedIn);
      
      if (this.isLoggedIn) {
        console.log('User is logged in, checking volunteer status');
        this.checkVolunteerStatus();
      } else {
        console.log('User is not logged in, setting isVolunteer to false');
        this.isVolunteer = false;
        this.cdr.detectChanges();
      }
    });
  }

  private async checkVolunteerStatus() {
    try {
      console.log('Starting volunteer status check...');
      this.isVolunteer = await this.reportService.checkVolunteerAccess();
      console.log('Volunteer status check completed. isVolunteer:', this.isVolunteer);
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error checking volunteer status:', error);
      this.isVolunteer = false;
      this.cdr.detectChanges();
    }
  }

  onSubscribe() {
    console.log('Subscribe to alerts:', this.email);
    this.email = '';
  }

  logout() {
    console.log('Logging out...');
    this.authService.logout();
  }
}