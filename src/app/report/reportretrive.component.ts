import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService } from '../services/report.service';
import { RouterModule } from '@angular/router';
import { Report } from '../models/r.model';


@Component({
  selector: 'app-report-retrieval',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="report-retrieval-container">
      <h1>Submitted Reports</h1>

      <div *ngIf="isLoading" class="loading-spinner">Loading reports...</div>
      <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div *ngIf="!isLoading && reports.length === 0" class="empty-state">No reports found.</div>

      <div *ngIf="!isLoading && reports.length > 0" class="reports-grid">
        <div *ngFor="let report of reports" class="report-card">
          <h3>{{ report.type | titlecase }}</h3>
          <span class="urgency-badge" [ngClass]="getUrgencyClass(report.urgency)">
            {{ report.urgency | titlecase }}
          </span>
          <p>{{ report.description }}</p>
          <div *ngIf="report.imageUrl" class="report-image">
            <img [src]="report.imageUrl" alt="Report Image" />
        </div>

          <div class="location"><span>📍</span>{{ report.location.address }}</div>
          <div class="contact"><span>📞</span>{{ report.contact }}</div>
          <div class="timestamp">Reported on: {{ formatDate(report.created_at) }}</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .report-retrieval-container {
      padding: 2rem;
      text-align: center;
      color: #322d29;
      background-color: #d1c7bd;
    }
  
    .reports-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1rem;
    }
    .report-image img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  object-fit: cover;
  max-height: 200px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

    .report-card {
      padding: 1rem;
      border: 1px solid #ac9cbd;
      border-radius: 8px;
      background-color: #fff;
      box-shadow: 0 2px 5px rgba(50, 45, 41, 0.2);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
  
    .report-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 10px rgba(50, 45, 41, 0.4);
    }
  
    .urgency-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-weight: bold;
      background-color: #72383d;
      color: #d1c7bd;
    }
  
    .location,
    .contact {
      margin-top: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #72383d;
    }
  
    .timestamp {
      color: #ac9cbd;
      font-size: 0.875rem;
    }
  
    .header h1 {
      color: #72383d;
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
  
    .header p {
      color: #ac9cbd;
      font-size: 1.125rem;
    }
  
    .description {
      color: #322d29;
    }
  
    .error-message {
      color: #72383d;
      background: rgba(114, 56, 61, 0.1);
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }
  `]
  
})
export class ReportRetrievalComponent implements OnInit {
  reports: Report[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private reportService: ReportService) {}

  async ngOnInit() {
    try {
        this.reports = (await this.reportService.getAllReports()) as unknown as Report[];
    } catch (error) {
      this.errorMessage = 'Failed to load reports. Please try again later.';
      console.error('Error fetching reports:', error);
    } finally {
      this.isLoading = false;
    }
  }

//   getLocationAddress(locationString: string): string {
//     try {
//       const location = JSON.parse(locationString);
//       return location.address || 'Unknown Location';
//     } catch (error) {
//       return 'Unknown Location';
//     }
//   }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  }

  getUrgencyClass(urgency: string): string {
    return urgency.toLowerCase();
  }
}
