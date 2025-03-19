// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';
// import { AuthService } from '../../services/auth.service';
// import { CampService } from '../../services/campservice';
// import { ReliefCampService } from '../../services/relief-camp.service';
// @Component({
//   selector: 'app-camp-list',
//   standalone: true,
//   imports: [CommonModule, RouterModule],
//   template: `
//     <div class="camps-container">
//       <div class="camps-header">
//         <div class="container">
//           <h1>Relief Camps</h1>
//           <p>Manage your relief camps and their members</p>
//         </div>
//       </div>

//       <div class="container camps-content">
//         <div class="camps-actions">
//           <a routerLink="/volunteer/camps/new" class="btn btn-primary">Add New Camp</a>
//         </div>

//         <div *ngIf="isLoading" class="loading-state">
//           <p>Loading camps...</p>
//         </div>

//         <div *ngIf="!isLoading && camps.length === 0" class="empty-state card">
//           <div class="empty-icon">🏕️</div>
//           <h3>No Relief Camps Yet</h3>
//           <p>Create a relief camp to manage resources and track people in need.</p>
//           <a routerLink="/volunteer/camps/new" class="btn btn-primary">Create Your First Camp</a>
//         </div>

//         <div *ngIf="!isLoading && camps.length > 0" class="camps-grid">
//           <div *ngFor="let camp of camps" class="camp-card card">
//             <div class="camp-header">
//               <h3>{{ camp.name }}</h3>
//               <div class="camp-location">
//                 <span class="location-icon">📍</span>
//                 {{ camp.location }}
//               </div>
//             </div>
            
//             <div class="camp-details">
//               <div class="camp-detail">
//                 <span class="detail-label">Capacity:</span>
//                 <span class="detail-value">{{ camp.capacity || 'Not specified' }}</span>
//               </div>
//               <div class="camp-detail">
//                 <span class="detail-label">Created:</span>
//                 <span class="detail-value">{{ formatDate(camp.created_at) }}</span>
//               </div>
//               <div *ngIf="camp.description" class="camp-description">
//                 <p>{{ truncateText(camp.description, 100) }}</p>
//               </div>
//             </div>
            
//             <div class="camp-actions">
//              <a [routerLink]="['/volunteer/camps', camp.id, 'residents', 'new']" class="btn btn-primary">Add residents</a>
//               <a [routerLink]="['/volunteer/camps/edit', camp.id]" class="btn btn-secondary">Edit</a>
//               <button class="btn btn-danger" (click)="deleteCamp(camp.id)">Delete</button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   `,
//   styles: [`
//     .camps-container {
//       min-height: calc(100vh - 72px);
//       background: var(--background);
//     }

//     .camps-header {
//       background: var(--primary);
//       color: white;
//       padding: 2rem 0;
//     }

//     .camps-header h1 {
//       margin-bottom: 0.5rem;
//       font-size: 2rem;
//     }

//     .camps-content {
//       padding: 2rem 1.5rem;
//     }

//     .camps-actions {
//       margin-bottom: 2rem;
//       display: flex;
//       justify-content: flex-end;
//     }

//     .camps-grid {
//       display: grid;
//       grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
//       gap: 1.5rem;
//     }

//     .camp-card {
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
//   padding: 1rem;
//   width: 100%;
//   height: auto;
//   aspect-ratio: 16 / 9; /* Adjust the box ratio */
//   background: var(--card-bg);
//   border-radius: 8px;
// }

//     .camp-header {
//       display: flex;
//   flex-direction: column;
//   gap: 0.5rem;
//     }

//     .camp-header h3 {
//       margin-bottom: 1.5rem;
//     }

//     .camp-location {
//       display: flex;
//   align-items: center;
//   font-size: min(1vw, 0.875rem); /* Scales with viewport */
//   color: var(--text-secondary);
//   flex-wrap: wrap;
//   max-width: 100%;
//   word-break: break-word;
//     }

//     .location-icon {
//       margin-right: 0.25rem;
//     }

//     .camp-details {
//       flex-grow: 1;
//       margin-bottom: 1.5rem;
//     }

//     .camp-detail {
//       display: flex;
//       margin-bottom: 0.5rem;
//     }

//     .detail-label {
//       font-weight: 500;
//       width: 80px;
//       color: var(--text-secondary);
//     }

//     .camp-description {
//       margin-top: 0.5rem;
//       color: var(--text-secondary);
//     }

//     .camp-actions {
//       display: flex;
//       gap: 0.5rem;
//       margin-top: auto;
//       flex-wrap: wrap;
//     }

//     .btn-danger {
//       background: var(--error);
//       color: white;
//     }

//     .btn-danger:hover {
//       background: #c0392b;
//     }

//     .empty-state {
//       text-align: center;
//       padding: 3rem;
//     }

//     .empty-icon {
//       font-size: 3rem;
//       margin-bottom: 1rem;
//     }

//     .empty-state h3 {
//       margin-bottom: 0.5rem;
//     }

//     .empty-state p {
//       margin-bottom: 1.5rem;
//       color: var(--text-secondary);
//     }

//     .loading-state {
//       text-align: center;
//       padding: 3rem;
//       color: var(--text-secondary);
//     }

//     @media (max-width: 768px) {
//       .camps-grid {
//         grid-template-columns: 1fr;
//       }
//     }
//   `]
// })
// export class CampListComponent implements OnInit {
//   camps: any[] = [];
//   isLoading = true;
//   currentUser: any = null;

//   constructor(
//     private authService: AuthService,
//     private campService: CampService,
//     private reliefCampService: ReliefCampService
//   ) {}

//   ngOnInit() {
//     this.authService.currentUser$.subscribe(user => {
//       this.currentUser = user;
//       if (user) {
//         this.loadCamps();
//       }
//     });
//   }

//   async loadCamps() {
//     this.isLoading = true;
//     try {
//       this.camps = await this.campService.getAllCamps(this.currentUser.user_id);
//     } catch (error) {
//       console.error('Error loading camps:', error);
//     } finally {
//       this.isLoading = false;
//     }
//   }

//   truncateText(text: string, maxLength: number): string {
//     if (!text) return '';
//     if (text.length <= maxLength) return text;
//     return text.substring(0, maxLength) + '...';
//   }

//   formatDate(dateString: string): string {
//     if (!dateString) return '';
//     const date = new Date(dateString);
//     return date.toLocaleDateString();
//   }

//   async deleteCamp(id: string) {
//     if (!confirm('Are you sure you want to delete this camp? This will also delete all member records.')) return;

//     try {
//       await this.campService.deleteCamp(id);
//       this.camps = this.camps.filter(camp => camp.id !== id);
//     } catch (error) {
//       console.error('Error deleting camp:', error);
//     }
//   }
// }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CampService } from '../../services/campservice';
import { ReliefCampService } from '../../services/relief-camp.service';

@Component({
  selector: 'app-camp-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="camps-container">
      <div class="camps-header">
        <div class="container">
          <h1>Relief Camps</h1>
          <p>Manage your relief camps and their members</p>
        </div>
      </div>

      <div class="container camps-content">
        <div class="camps-actions">
          <a routerLink="/volunteer/camps/new" class="btn btn-primary">Add New Camp</a>
        </div>

        <div *ngIf="isLoading" class="loading-state">
          <p>Loading camps...</p>
        </div>

        <div *ngIf="!isLoading && camps.length === 0" class="empty-state card">
          <div class="empty-icon">🏕️</div>
          <h3>No Relief Camps Yet</h3>
          <p>Create a relief camp to manage resources and track people in need.</p>
          <a routerLink="/volunteer/camps/new" class="btn btn-primary">Create Your First Camp</a>
        </div>

        <div *ngIf="!isLoading && camps.length > 0" class="camps-grid">
          <div *ngFor="let camp of camps" class="camp-card card">
            <div class="camp-header">
              <h3>{{ camp.name }}</h3>
              <div class="camp-location">
                <span class="location-icon">📍</span>
                {{ camp.location.address || 'Location not specified' }}
              </div>

            </div>
            
            <div class="camp-details">
              <div class="camp-detail">
                <span class="detail-label">Capacity:</span>
                <span class="detail-value">{{ camp.capacity || 'Not specified' }}</span>
              </div>
              <div class="camp-detail">
                <span class="detail-label">Current Count:</span>
                <span class="detail-value">{{ camp.curr_count || 0 }}</span>
              </div>
              <div class="camp-detail">
                <span class="detail-label">Created:</span>
                <span class="detail-value">{{ formatDate(camp.created_at) }}</span>
              </div>
              <div *ngIf="camp.description" class="camp-description">
                <p>{{ truncateText(camp.description, 100) }}</p>
              </div>
            </div>
            
            <div class="camp-actions">
              <button 
                [disabled]="camp.curr_count >= camp.capacity"
                [class.btn-disabled]="camp.curr_count >= camp.capacity"
                (click)="addResidentToCamp(camp.id)" 
                class="btn btn-primary">
                {{ camp.curr_count >= camp.capacity ? 'Camp Full' : 'Add Residents' }}
              </button>
              <!-- Add residents button with the correct route -->
              <!-- <a [routerLink]="['/volunteer/camps', camp.id, 'residents', 'new']" class="btn btn-primary">Add Residents</a> -->
              
              <!-- View residents button -->
              <a [routerLink]="['/volunteer/camps', camp.id, 'residents']" class="btn btn-secondary">View Residents</a>
              
              <!-- Edit camp button -->
              <!-- <a [routerLink]="['/volunteer/camps/edit', camp.id]" class="btn btn-secondary">Edit</a> -->
              
              <!-- Delete camp button -->
              <!-- <button class="btn btn-danger" (click)="deleteCamp(camp.id)">Delete</button> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .camps-container {
      min-height: calc(100vh - 72px);
      background: var(--background);
    }

    .camps-header {
      background: var(--primary);
      color: white;
      padding: 2rem 0;
    }

    .camps-header h1 {
      margin-bottom: 0.5rem;
      font-size: 2rem;
    }

    .camps-content {
      padding: 2rem 1.5rem;
    }

    .camps-actions {
      margin-bottom: 2rem;
      display: flex;
      justify-content: flex-end;
    }

    .camps-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .camp-card {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 1rem;
      width: 100%;
      height: auto;
      aspect-ratio: 16 / 9; /* Adjust the box ratio */
      background: var(--card-bg);
      border-radius: 8px;
    }

    .camp-header {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .camp-header h3 {
      margin-bottom: 1.5rem;
    }

    .camp-location {
      display: flex;
      align-items: center;
      font-size: min(1vw, 0.875rem); /* Scales with viewport */
      color: var(--text-secondary);
      flex-wrap: wrap;
      max-width: 100%;
      word-break: break-word;
    }

    .location-icon {
      margin-right: 0.25rem;
    }

    .camp-details {
      flex-grow: 1;
      margin-bottom: 1.5rem;
    }

    .camp-detail {
      display: flex;
      margin-bottom: 0.5rem;
    }

    .detail-label {
      font-weight: 500;
      width: 80px;
      color: var(--text-secondary);
    }

    .camp-description {
      margin-top: 0.5rem;
      color: var(--text-secondary);
    }

    .camp-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: auto;
      flex-wrap: wrap;
    }

    .btn-danger {
      background: var(--error);
      color: white;
    }

    .btn-danger:hover {
      background: #c0392b;
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
      .camps-grid {
        grid-template-columns: 1fr;
      }
      
      .camp-actions {
        flex-direction: column;
        gap: 0.75rem;
      }
      
      .btn {
        width: 100%;
        text-align: center;
      }
    }
  `]
})
export class CampListComponent implements OnInit {
  camps: any[] = [];
  isLoading = true;
  currentUser: any = null;

  constructor(
    private authService: AuthService,
    private campService: CampService,
    private reliefCampService: ReliefCampService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadCamps();
      }
    });
  }

  async loadCamps() {
      this.isLoading = true;
      try {
        this.camps = await this.campService.getAllCamps(this.currentUser.user_id);
    
        // Ensure location is parsed as an object
        this.camps = this.camps.map(camp => ({
          ...camp,
          location: typeof camp.location === 'string' ? JSON.parse(camp.location) : camp.location
        }));
      } catch (error) {
        console.error('Error loading camps:', error);
      } finally {
        this.isLoading = false;
      }
  }

  truncateText(text: string, maxLength: number): string {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  async deleteCamp(id: string) {
    if (!confirm('Are you sure you want to delete this camp? This will also delete all member records.')) return;

    try {
      await this.campService.deleteCamp(id);
      this.camps = this.camps.filter(camp => camp.id !== id);
    } catch (error) {
      console.error('Error deleting camp:', error);
    }
  }
  
  // Navigate programmatically to add resident form with camp ID
  addResidentToCamp(campId: string) {
    this.router.navigate(['/volunteer/camps', campId, 'residents', 'new']);
  }
  
  // Navigate programmatically to view residents for a camp
  viewCampResidents(campId: string) {
    this.router.navigate(['/volunteer/camps', campId, 'residents']);
  }
}