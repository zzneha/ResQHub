import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CampService } from '../../services/campservice';
import { ReliefCampService } from '../../services/relief-camp.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-camp-residents',
  standalone: true,
  imports: [CommonModule, RouterModule,FormsModule],
  template: `
    <div class="residents-container">
      <div class="residents-header">
        <div class="container">
          <div class="header-content">
            <div>
              <h1>{{ campName }} - Residents</h1>
              <p>Manage the residents in this relief camp</p>
            </div>
            <div class="back-link">
              <a routerLink="/volunteer/camps" class="btn btn-secondary">Back to Camps</a>
            </div>
          </div>
        </div>
      </div>

      <div class="container residents-content">
        <div class="residents-actions">
          <a [routerLink]="['/volunteer/camps', campId, 'residents', 'new']" class="btn btn-primary">Add New Resident</a>
        </div>

        <div *ngIf="isLoading" class="loading-state">
          <p>Loading residents...</p>
        </div>

        <div *ngIf="!isLoading && residents.length === 0" class="empty-state card">
          <div class="empty-icon">👥</div>
          <h3>No Residents Registered</h3>
          <p>Add residents to keep track of people staying at this camp.</p>
          <a [routerLink]="['/volunteer/camps', campId, 'residents', 'new']" class="btn btn-primary">Register First Resident</a>
        </div>

        <div *ngIf="!isLoading && residents.length > 0" class="residents-table-container">
          <div class="filters">
            <input type="text" placeholder="Search by name..." class="search-input" [(ngModel)]="searchQuery" (input)="filterResidents()">
          </div>
          
          <table class="residents-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Medical Needs</th>
                <th>Arrival Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let resident of filteredResidents">
                <td>{{ resident.full_name }}</td>
                <td>{{ resident.age || 'N/A' }}</td>
                <td>{{ resident.gender || 'N/A' }}</td>
                <td>
                  <span *ngIf="resident.medical_needs" class="medical-tag">Yes</span>
                  <span *ngIf="!resident.medical_needs">No</span>
                </td>
                <td>{{ formatDate(resident.arrival_date) }}</td>
                <td class="action-buttons">
                  <a [routerLink]="['/volunteer/camps', campId, 'residents', 'edit', resident.id]" class="btn btn-sm btn-secondary">Edit</a>
                  <button class="btn btn-sm btn-danger" (click)="deleteResident(resident.id)">Remove</button>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="summary-stats">
            <div class="stat-item">
              <span class="stat-label">Total Residents:</span>
              <span class="stat-value">{{ residents.length }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Medical Cases:</span>
              <span class="stat-value">{{ medicalNeedsCount }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .residents-container {
      min-height: calc(100vh - 72px);
      background: var(--background);
    }

    .residents-header {
      background: var(--primary);
      color: white;
      padding: 2rem 0;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .residents-header h1 {
      margin-bottom: 0.5rem;
      font-size: 2rem;
    }

    .residents-content {
      padding: 2rem 1.5rem;
    }

    .residents-actions {
      margin-bottom: 2rem;
      display: flex;
      justify-content: flex-end;
    }

    .residents-table-container {
      background: var(--card-bg);
      border-radius: 8px;
      padding: 1.5rem;
      overflow-x: auto;
    }

    .filters {
      margin-bottom: 1rem;
    }

    .search-input {
      padding: 0.5rem;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      width: 300px;
      max-width: 100%;
    }

    .residents-table {
      width: 100%;
      border-collapse: collapse;
    }

    .residents-table th,
    .residents-table td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid var(--border-color);
    }

    .residents-table th {
      font-weight: 600;
      color: var(--text-secondary);
    }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .btn-sm {
      padding: 0.25rem 0.5rem;
      font-size: 0.875rem;
    }

    .medical-tag {
      background: var(--error-light);
      color: var(--error);
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.875rem;
    }

    .summary-stats {
      display: flex;
      gap: 2rem;
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border-color);
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .stat-label {
      font-weight: 500;
      color: var(--text-secondary);
    }

    .stat-value {
      font-weight: 600;
      font-size: 1.125rem;
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
    }

    .empty-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      margin-bottom: 0.5rem;
    }

    .empty-state p {
      margin-bottom: 1.5rem;
      color: var(--text-secondary);
    }

    .loading-state {
      text-align: center;
      padding: 3rem;
      color: var(--text-secondary);
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
      
      .back-link {
        width: 100%;
      }
      
      .back-link a {
        display: block;
        width: 100%;
        text-align: center;
      }
      
      .residents-actions {
        justify-content: center;
      }
      
      .residents-actions a {
        width: 100%;
        text-align: center;
      }
      
      .residents-table-container {
        padding: 1rem 0.5rem;
      }
      
      .search-input {
        width: 100%;
      }
      
      .action-buttons {
        flex-direction: column;
      }
      
      .summary-stats {
        flex-direction: column;
        gap: 1rem;
      }
    }
  `]
})
export class CampResidentsComponent implements OnInit {
  campId: string = '';
  campName: string = 'Relief Camp';
  residents: any[] = [];
  filteredResidents: any[] = [];
  isLoading: boolean = true;
  searchQuery: string = '';
  medicalNeedsCount: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private campService: CampService,
    private reliefCampService: ReliefCampService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.campId = params['id'];
      if (this.campId) {
        this.loadCampDetails();
        this.loadResidents();
      } else {
        this.router.navigate(['/volunteer/camps']);
      }
    });
  }

  async loadCampDetails() {
    try {
      const camp = await this.campService.getCampById(this.campId);
      if (camp) {
        this.campName = camp.name;
      }
    } catch (error) {
      console.error('Error loading camp details:', error);
    }
  }

  async loadResidents() {
    this.isLoading = true;
    try {
      this.residents = await this.reliefCampService.getResidents(this.campId);
      this.filterResidents();
      this.calculateStats();
    } catch (error) {
      console.error('Error loading residents:', error);
    } finally {
      this.isLoading = false;
    }
  }

  filterResidents() {
    if (!this.searchQuery) {
      this.filteredResidents = [...this.residents];
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredResidents = this.residents.filter(resident => 
        resident.full_name?.toLowerCase().includes(query) || 
        resident.age?.toString().includes(query) || 
        resident.gender?.toLowerCase().includes(query)
      );
    }
  }

  calculateStats() {
    this.medicalNeedsCount = this.residents.filter(resident => resident.medical_needs).length;
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  async deleteResident(id: string) {
    if (!confirm('Are you sure you want to remove this resident from the camp?')) return;

    try {
      await this.reliefCampService.deleteResident(id);
      this.residents = this.residents.filter(resident => resident.id !== id);
      this.filterResidents();
      this.calculateStats();
    } catch (error) {
      console.error('Error removing resident:', error);
    }
  }
}