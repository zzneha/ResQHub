import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ReliefCampService } from '../../services/relief-camp.service';

@Component({
  selector: 'app-camp-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="camp-form-container">
      <div class="camp-form-header">
        <div class="container">
          <h1>{{ isEditMode ? 'Edit Relief Camp' : 'Add New Relief Camp' }}</h1>
          <p>{{ isEditMode ? 'Update your existing relief camp' : 'Create a new relief camp to manage resources and people' }}</p>
        </div>
      </div>

      <div class="container camp-form-content">
        <div class="camp-form-card card">
          <form (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label class="form-label">Camp Name</label>
              <input 
                type="text" 
                class="form-input"
                [(ngModel)]="campForm.name"
                name="name"
                required>
            </div>

            <div class="form-group">
              <label class="form-label">Location</label>
              <input 
                type="text" 
                class="form-input"
                [(ngModel)]="campForm.location"
                name="location"
                placeholder="Address or coordinates"
                required>
            </div>

            <div class="form-group">
              <label class="form-label">Capacity</label>
              <input 
                type="number" 
                class="form-input"
                [(ngModel)]="campForm.capacity"
                name="capacity"
                placeholder="Maximum number of people">
            </div>

            <!-- <div class="form-group">
              <label class="form-label">Description</label>
              <textarea 
                class="form-input"
                [(ngModel)]="campForm.description"
                name="description"
                rows="4"
                placeholder="Additional details about the camp"></textarea>
            </div> -->

            <div *ngIf="errorMessage" class="error-message">
              {{ errorMessage }}
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-secondary" routerLink="/volunteer/camps">Cancel</button>
              <button type="submit" class="btn btn-primary" [disabled]="isLoading">
                {{ isLoading ? 'Saving...' : (isEditMode ? 'Update Camp' : 'Create Camp') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .camp-form-container {
      min-height: calc(100vh - 72px);
      background: var(--background);
    }

    .camp-form-header {
      background: var(--primary);
      color: white;
      padding: 2rem 0;
    }

    .camp-form-header h1 {
      margin-bottom: 0.5rem;
      font-size: 2rem;
    }

    .camp-form-content {
      padding: 2rem 1.5rem;
    }

    .camp-form-card {
      max-width: 800px;
      margin: 0 auto;
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
  `]
})
export class CampFormComponent implements OnInit {
  isEditMode = false;
  campId: string | null = null;
  isLoading = false;
  errorMessage = '';
  
  campForm = {
    name: '',
    location: '',
    capacity: null as number | null,
    //description: ''
  };

  constructor(
    private authService: AuthService,
    private campService: ReliefCampService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.campId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.campId;
    
    if (this.isEditMode && this.campId) {
      this.loadCamp(this.campId);
    }
  }

  async loadCamp(id: string) {
    try {
      const camp = await this.campService.getCampById(id);
      if (camp) {
        this.campForm = {
          name: camp.name,
          location: camp.location,
          capacity: camp.capacity,
                // description: camp.description || ''
        };
      } else {
        this.errorMessage = 'Camp not found';
        setTimeout(() => {
          this.router.navigate(['/volunteer/camps']);
        }, 2000);
      }
    } catch (error) {
      console.error('Error loading camp:', error);
      this.errorMessage = 'Failed to load camp';
    }
  }

  async onSubmit() {
    if (!this.campForm.name || !this.campForm.location) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      if (this.isEditMode && this.campId) {
        // Update existing camp
        await this.campService.updateCamp(this.campId, {
          name: this.campForm.name,
          location: this.campForm.location,
          capacity: this.campForm.capacity,
          //description: this.campForm.description
        });
      } else {
        // Create new camp
        await this.campService.createCamp({
          volunteer_id: this.authService.getCurrentUser().user_id,
          name: this.campForm.name,
          location: this.campForm.location,
          capacity: this.campForm.capacity,
         // description: this.campForm.description
        });
      }
      
      this.router.navigate(['/volunteer/camps']);
    } catch (error) {
      console.error('Error saving camp:', error);
      this.errorMessage = 'Failed to save camp. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }
}