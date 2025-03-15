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
    <header class="header">
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
          <a routerLink="/home" routerLinkActive="active" class="nav-link">Home</a>
          <a routerLink="/training" routerLinkActive="active" class="nav-link">Training</a>
          <a routerLink="/shelters" routerLinkActive="active" class="nav-link">Find Shelter</a>
        </nav>
        <div class="action-buttons">
          <a *ngIf="isVolunteer" routerLink="/report" class="btn btn-primary">Report</a>
          <ng-container *ngIf="isLoggedIn; else loginTemplate">
            <div class="user-menu">
              <a routerLink="/account" class="btn btn-secondary">Account</a>
              <button class="btn btn-secondary" (click)="logout()">Logout</button>
            </div>
          </ng-container>
          <ng-template #loginTemplate>
            <a routerLink="/login" class="btn btn-secondary">Login</a>
          </ng-template>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background: #efe9e1;
      border-bottom: 1px solid #d1c7bd;
      position: sticky;
      top: 0;
      z-index: 100;
      color: #322d29;
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
      color: #322d29;
      font-family: 'Space Grotesk', sans-serif;
      font-weight: 600;
      font-size: 1.25rem;
    }

    .logo-icon {
      width: 28px;
      height: 28px;
      fill: #72383d;
    }

    .nav-links {
      display: flex;
      gap: 2rem;
    }

    .nav-link {
      color: #72383d;
      text-decoration: none;
      font-weight: 500;
      position: relative;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .nav-link:hover,
    .nav-link.active {
      color: #322d29;
      background: #d1c7bd;
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
      background: #72383d;
      color: white;
      border: none;
      transition: all 0.3s ease;
    }

    .btn-primary:hover {
      background: #322d29;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .btn-secondary {
      background: #d1c7bd;
      color: #322d29;
      border: 1px solid #ac9cbd;
      transition: all 0.3s ease;
    }

    .btn-secondary:hover {
      background: #ac9cbd;
      border-color: #72383d;
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
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      if (this.isLoggedIn) {
        this.checkVolunteerStatus();
      } else {
        this.isVolunteer = false;
        this.cdr.detectChanges();
      }
    });
  }

  private async checkVolunteerStatus() {
    try {
      this.isVolunteer = await this.reportService.checkVolunteerAccess();
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error checking volunteer status:', error);
      this.isVolunteer = false;
      this.cdr.detectChanges();
    }
  }

  logout() {
    this.authService.logout();
  }
}
