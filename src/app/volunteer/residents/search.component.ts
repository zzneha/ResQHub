import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReliefCampService } from '../../services/relief-camp.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="search-container">
      <h1>Search Camp Residents</h1>
      <input type="text" [(ngModel)]="searchQuery" placeholder="Search by name, age, camp, or contact..." (input)="filterResidents()" />

      <div *ngIf="isLoading" class="loading-spinner">Loading residents...</div>
      <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div *ngIf="!isLoading && filteredResidents.length === 0" class="empty-state">No residents found.</div>

      <table *ngIf="!isLoading && filteredResidents.length > 0" class="residents-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Camp</th>
            <th>Contact</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let resident of filteredResidents" class="resident-row">
            <td>{{ resident.full_name }}</td>
            <td>{{ resident.age }}</td>
            <td>{{ resident.camp_name }}</td>
            <td>{{ resident.contact_number }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .search-container { padding: 2rem; text-align: center; background-color: #d1c7bd; color: #322d29; }
    input { padding: 0.5rem; width: 60%; margin-bottom: 1rem; border-radius: 8px; border: 1px solid #ac9cbd; color: #322d29; }
    .residents-table { width: 100%; border-collapse: collapse; margin-top: 1rem; background-color: #fff; box-shadow: 0 2px 5px rgba(50, 45, 41, 0.2); }
    th, td { padding: 0.8rem; border: 1px solid #ac9cbd; text-align: left; }
    th { background-color: #72383d; color: #fff; }
    .resident-row:hover { background-color: #f5e6dc; transition: background-color 0.2s ease; }
    h3 { color: #72383d; font-size: 1.5rem; margin-bottom: 0.5rem; }
    p { color: #322d29; margin: 0.2rem 0; font-size: 1rem; }
    .error-message { color: #72383d; background: rgba(114, 56, 61, 0.1); padding: 1rem; border-radius: 8px; }
  `]
})
export class SearchComponent implements OnInit {
  residents: any[] = [];
  filteredResidents: any[] = [];
  searchQuery = '';
  isLoading = true;
  errorMessage = '';

  constructor(private reliefcampservice: ReliefCampService) {}

  async ngOnInit() {
    try {
      const data = await this.reliefcampservice.getAllResidents();
      this.residents = data;
      this.filteredResidents = data;
    } catch (error) {
      this.errorMessage = 'Failed to load camp residents. Please try again later.';
      console.error('Error fetching residents:', error);
    } finally {
      this.isLoading = false;
    }
  }

  filterResidents() {
    const query = this.searchQuery.toLowerCase();
    this.filteredResidents = this.residents.filter((resident) =>
      resident.full_name.toLowerCase().includes(query) ||
      resident.age.toString().includes(query) ||
      resident.camp_name.toLowerCase().includes(query) ||
      resident.contact_number.toLowerCase().includes(query)
    );
  }
}