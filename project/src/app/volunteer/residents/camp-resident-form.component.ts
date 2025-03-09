import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ReliefCampService } from '../../services/relief-camp.service';

interface Resident {
  id?: string;
  camp_id: string;
  full_name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  contact_number?: string;
  medical_conditions?: string;
  family_members: number;
  arrival_date: string;
  special_needs?: string;
  status: 'active' | 'relocated' | 'departed';
}

@Component({
  selector: 'app-camp-resident-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="resident-form-container">
      <div class="resident-form-header glass">
        <div class="container">
          <h1>{{ isEditMode ? 'Edit Resident Details' : 'Add New Resident' }}</h1>
          <p>{{ isEditMode ? 'Update existing resident information' : 'Register a new resident for the camp' }}</p>
        </div>
      </div>

      <div class="container resident-form-content">
        <div class="resident-form-card card">
          <form (ngSubmit)="onSubmit()" #residentForm="ngForm">
            <div class="form-group">
              <label class="form-label">Full Name *</label>
              <input 
                type="text" 
                class="form-input"
                [(ngModel)]="resident.full_name"
                name="full_name"
                required>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Age *</label>
                <input 
                  type="number" 
                  class="form-input"
                  [(ngModel)]="resident.age"
                  name="age"
                  required
                  min="0"
                  max="120">
              </div>

              <div class="form-group">
                <label class="form-label">Gender *</label>
                <select 
                  class="form-input"
                  [(ngModel)]="resident.gender"
                  name="gender"
                  required>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Contact Number</label>
                <input 
                  type="tel" 
                  class="form-input"
                  [(ngModel)]="resident.contact_number"
                  name="contact_number"
                  pattern="[0-9]{10}">
              </div>

              <div class="form-group">
                <label class="form-label">Family Members *</label>
                <input 
                  type="number" 
                  class="form-input"
                  [(ngModel)]="resident.family_members"
                  name="family_members"
                  required
                  min="1">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Medical Conditions</label>
              <textarea 
                class="form-input"
                [(ngModel)]="resident.medical_conditions"
                name="medical_conditions"
                rows="2"
                placeholder="List any medical conditions or medications"></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Special Needs</label>
              <textarea 
                class="form-input"
                [(ngModel)]="resident.special_needs"
                name="special_needs"
                rows="2"
                placeholder="Any special requirements or assistance needed"></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Arrival Date *</label>
                <input 
                  type="date" 
                  class="form-input"
                  [(ngModel)]="resident.arrival_date"
                  name="arrival_date"
                  required>
              </div>

              <div class="form-group">
                <label class="form-label">Status *</label>
                <select 
                  class="form-input"
                  [(ngModel)]="resident.status"
                  name="status"
                  required>
                  <option value="active">Active</option>
                  <option value="relocated">Relocated</option>
                  <option value="departed">Departed</option>
                </select>
              </div>
            </div>

            <div *ngIf="errorMessage" class="error-message">
              {{ errorMessage }}
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-secondary" (click)="goBack()">Cancel</button>
              <button type="submit" class="btn btn-primary" [disabled]="!residentForm.form.valid || isLoading">
                {{ isLoading ? 'Saving...' : (isEditMode ? 'Update Resident' : 'Register Resident') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .resident-form-container {
      min-height: calc(100vh - 72px);
      background: var(--background);
    }

    .resident-form-header {
      background: #229954;
      color: white;
      padding: 2rem 0;
      margin-bottom: 2rem;
    }

    .resident-form-header h1 {
      margin-bottom: 0.5rem;
      font-size: 2rem;
    }

    .resident-form-content {
      padding: 0 1.5rem 2rem;
    }

    .resident-form-card {
      max-width: 800px;
      margin: 0 auto;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
    }

    .error-message {
      color: var(--error);
      margin-bottom: 1rem;
      font-size: 0.875rem;
    }

    .btn-primary {
      background: #229954;
      color: white;
      border: none;
      transform: translateY(0);
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
      border-color: rgba(34, 153, 84, 0.3);
      transform: translateY(-1px);
    }

    .form-input:focus {
      outline: none;
      border-color: #229954;
      box-shadow: 0 0 0 3px rgba(34, 153, 84, 0.1);
    }

    @media (max-width: 640px) {
      .form-row {
        grid-template-columns: 1fr;
        gap: 0;
      }
    }
  `]
})
export class CampResidentFormComponent implements OnInit {
  isEditMode = false;
  residentId: string | null = null;
  campId: string | null = null;
  isLoading = false;
  errorMessage = '';
  
  resident: Resident = {
    camp_id: '',
    full_name: '',
    age: 0,
    gender: 'male',
    family_members: 1,
    arrival_date: new Date().toISOString().split('T')[0],
    status: 'active'
  };

  constructor(
    private authService: AuthService,
    private campService: ReliefCampService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.campId = this.route.snapshot.paramMap.get('campId');
    this.residentId = this.route.snapshot.paramMap.get('residentId');
    
    if (!this.campId) {
      this.errorMessage = 'No camp specified';
      this.goBack();
      return;
    }

    this.resident.camp_id = this.campId;
    this.isEditMode = !!this.residentId;
    
    if (this.isEditMode && this.residentId) {
      this.loadResident(this.residentId);
    }
  }

  async loadResident(id: string) {
    try {
      const resident = await this.campService.getResidentById(id);
      if (resident) {
        this.resident = {
          ...resident,
          arrival_date: new Date(resident.arrival_date).toISOString().split('T')[0]
        };
      } else {
        this.errorMessage = 'Resident not found';
        setTimeout(() => this.goBack(), 2000);
      }
    } catch (error) {
      console.error('Error loading resident:', error);
      this.errorMessage = 'Failed to load resident details';
    }
  }

  async onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      if (this.isEditMode && this.residentId) {
        await this.campService.updateResident(this.residentId, this.resident);
      } else {
        await this.campService.addResident(this.resident);
      }
      this.goBack();
    } catch (error) {
      console.error('Error saving resident:', error);
      this.errorMessage = 'Failed to save resident details. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  goBack() {
    this.router.navigate(['/volunteer/camps', this.campId, 'residents']);
  }
} 