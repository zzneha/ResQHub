import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { PostService } from '../../services/post.service';
import { ReliefCampService } from '../../services/relief-camp.service';
import { Router } from '@angular/router';

interface Camp {
  id: string;
  name: string;
  location: string;
  capacity: number;
  resident_count?: number;
}

@Component({
  selector: 'app-volunteer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header glass">
        <div class="container">
          <h1>Volunteer Dashboard</h1>
          <p>Welcome back, {{ currentUser?.full_name }}</p>
        </div>
      </div>

      <div class="container dashboard-content">
        <div class="dashboard-sidebar">
          <div class="profile-card card">
            <div class="profile-header">
              <div class="profile-avatar">
                {{ getInitials(currentUser?.full_name) }}
              </div>
              <h3>{{ currentUser?.full_name }}</h3>
              <p>{{ currentUser?.email }}</p>
            </div>
            <div class="profile-details">
              <div class="profile-detail">
                <span class="detail-label">Phone:</span>
                <span class="detail-value">{{ currentUser?.phone }}</span>
              </div>
              <div class="profile-detail">
                <span class="detail-label">Skills:</span>
                <span class="detail-value">{{ currentUser?.skills || 'Not specified' }}</span>
              </div>
            </div>
            <div class="profile-actions">
              <button class="btn btn-secondary" (click)="showEditProfile = true">Edit Profile</button>
              <button class="btn btn-primary" (click)="logout()">Logout</button>
            </div>
          </div>

          <div class="nav-card card">
            <a routerLink="/volunteer/dashboard" routerLinkActive="active" class="nav-link">Dashboard</a>
            <a routerLink="/volunteer/posts" routerLinkActive="active" class="nav-link">My Posts</a>
            <a routerLink="/volunteer/camps" routerLinkActive="active" class="nav-link">Relief Camps</a>
            <a routerLink="/volunteer/search" routerLinkActive="active" class="nav-link">Search People</a>
            <a routerLink="/volunteer/chat" routerLinkActive="active" class="nav-link">Volunteer Forum</a>
            <a (click)="navigateToResidentForm()" class="nav-link pointer">Add New Resident</a>
          </div>
        </div>

        <div class="dashboard-main">
          <div class="stats-grid">
            <div class="stat-card card">
              <div class="stat-icon">📝</div>
              <div class="stat-content">
                <h3>{{ postCount }}</h3>
                <p>Posts</p>
              </div>
            </div>
            <div class="stat-card card">
              <div class="stat-icon">🏕️</div>
              <div class="stat-content">
                <h3>{{ campCount }}</h3>
                <p>Relief Camps</p>
              </div>
            </div>
            <div class="stat-card card">
              <div class="stat-icon">👥</div>
              <div class="stat-content">
                <h3>{{ memberCount }}</h3>
                <p>People Helped</p>
              </div>
            </div>
            <div class="stat-card card">
              <div class="stat-icon">💬</div>
              <div class="stat-content">
                <h3>{{ forumPostCount }}</h3>
                <p>Forum Posts</p>
              </div>
            </div>
          </div>

          <div class="quick-actions card">
            <h3>Quick Actions</h3>
            <div class="action-buttons">
              <a routerLink="/volunteer/posts/new" class="btn btn-primary">Create Post</a>
              <a routerLink="/volunteer/camps/new" class="btn btn-secondary">Add Relief Camp</a>
              <a routerLink="/volunteer/search" class="btn btn-secondary">Search People</a>
              <a routerLink="/volunteer/chat" class="btn btn-secondary">Volunteer Forum</a>
            </div>
          </div>

          <!-- New Camp Management Section -->
          <div class="my-camps card">
            <div class="section-header">
              <h3>My Relief Camps</h3>
              <a routerLink="/volunteer/camps/new" class="btn btn-primary btn-sm">Add New Camp</a>
            </div>

            <div *ngIf="camps.length === 0" class="empty-state">
              <p>You haven't registered any relief camps yet.</p>
              <a routerLink="/volunteer/camps/new" class="btn btn-primary">Register Your First Camp</a>
            </div>

            <div *ngIf="camps.length > 0" class="camps-grid">
              <div *ngFor="let camp of camps" class="camp-card glass-hover">
                <div class="camp-header">
                  <h4>{{ camp.name }}</h4>
                  <span class="resident-count">{{ camp.resident_count || 0 }} residents</span>
                </div>
                <p class="camp-location">📍 {{ camp.location }}</p>
                <div class="camp-capacity">
                  <div class="capacity-bar">
                    <div class="capacity-fill" 
                         [style.width]="getCapacityPercentage(camp) + '%'"
                         [class.near-full]="getCapacityPercentage(camp) > 80">
                    </div>
                  </div>
                  <span class="capacity-text">
                    {{ camp.resident_count || 0 }}/{{ camp.capacity }} capacity
                  </span>
                </div>
                <div class="camp-actions">
                  <a [routerLink]="['/volunteer/camps', camp.id, 'residents', 'new']" 
                     class="btn btn-primary btn-sm">
                    Add Resident
                  </a>
                  <a [routerLink]="['/volunteer/camps', camp.id, 'residents']" 
                     class="btn btn-secondary btn-sm">
                    View All
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div class="recent-posts card">
            <h3>Recent Posts</h3>
            <div *ngIf="posts.length === 0" class="empty-state">
              <p>You haven't created any posts yet.</p>
              <a routerLink="/volunteer/posts/new" class="btn btn-primary">Create Your First Post</a>
            </div>
            <div *ngIf="posts.length > 0" class="post-list">
              <div *ngFor="let post of posts.slice(0, 3)" class="post-item">
                <h4>{{ post.title }}</h4>
                <p>{{ truncateText(post.content, 100) }}</p>
                <div class="post-meta">
                  <span>{{ formatDate(post.created_at) }}</span>
                </div>
              </div>
              <a *ngIf="posts.length > 3" routerLink="/volunteer/posts" class="view-all">View all posts →</a>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Profile Modal -->
      <div *ngIf="showEditProfile" class="modal-overlay">
        <div class="modal-container">
          <div class="modal-header">
            <h3>Edit Profile</h3>
            <button class="close-btn" (click)="showEditProfile = false">×</button>
          </div>
          <div class="modal-body">
            <form (ngSubmit)="updateProfile()">
              <div class="form-group">
                <label class="form-label">Full Name</label>
                <input 
                  type="text" 
                  class="form-input"
                  [(ngModel)]="profileForm.fullName"
                  name="fullName"
                  required>
              </div>
              <div class="form-group">
                <label class="form-label">Phone</label>
                <input 
                  type="tel" 
                  class="form-input"
                  [(ngModel)]="profileForm.phone"
                  name="phone"
                  required>
              </div>
              <div class="form-group">
                <label class="form-label">Skills & Experience</label>
                <textarea 
                  class="form-input"
                  [(ngModel)]="profileForm.skills"
                  name="skills"
                  rows="3"></textarea>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" (click)="showEditProfile = false">Cancel</button>
                <button type="submit" class="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: calc(100vh - 72px);
      background: var(--background);
    }

    .dashboard-header {
      background: #229954;
      color: white;
      padding: 2rem 0;
    }

    .dashboard-header h1 {
      margin-bottom: 0.5rem;
      font-size: 2rem;
    }

    .dashboard-content {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 2rem;
      padding: 2rem 1.5rem;
    }

    .profile-card {
      margin-bottom: 1.5rem;
    }

    .profile-header {
      text-align: center;
      margin-bottom: 1.5rem;
    }

    .profile-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: #229954;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0 auto 1rem;
    }

    .profile-header h3 {
      margin-bottom: 0.25rem;
    }

    .profile-header p {
      color: var(--text-secondary);
      font-size: 0.875rem;
    }

    .profile-details {
      margin-bottom: 1.5rem;
    }

    .profile-detail {
      display: flex;
      margin-bottom: 0.5rem;
    }

    .detail-label {
      font-weight: 500;
      width: 80px;
      color: var(--text-secondary);
    }

    .profile-actions {
      display: flex;
      gap: 0.5rem;
    }

    .nav-card {
      display: flex;
      flex-direction: column;
    }

    .nav-link {
      padding: 0.75rem 1rem;
      color: var(--text-primary);
      text-decoration: none;
      border-radius: 4px;
      transition: all 0.2s ease;
    }

    .nav-link:hover, .nav-link.active {
      background: rgba(34, 153, 84, 0.1);
      color: #229954;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .stat-card {
      display: flex;
      align-items: center;
      padding: 1.5rem;
    }

    .stat-icon {
      font-size: 2rem;
      margin-right: 1rem;
    }

    .stat-content h3 {
      font-size: 1.5rem;
      margin-bottom: 0.25rem;
      color: #229954;
    }

    .stat-content p {
      color: var(--text-secondary);
      font-size: 0.875rem;
    }

    .quick-actions {
      margin-bottom: 1.5rem;
    }

    .quick-actions h3 {
      margin-bottom: 1rem;
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
    }

    .recent-posts h3 {
      margin-bottom: 1rem;
    }

    .post-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .post-item {
      padding-bottom: 1rem;
      border-bottom: 1px solid rgba(0,0,0,0.1);
    }

    .post-item:last-child {
      border-bottom: none;
    }

    .post-item h4 {
      margin-bottom: 0.5rem;
    }

    .post-meta {
      font-size: 0.75rem;
      color: var(--text-secondary);
      margin-top: 0.5rem;
    }

    .view-all {
      display: block;
      text-align: right;
      margin-top: 1rem;
      color: #229954;
      text-decoration: none;
    }

    .view-all:hover {
      color: #1a7441;
    }

    .empty-state {
      text-align: center;
      padding: 2rem 0;
    }

    .empty-state p {
      margin-bottom: 1rem;
      color: var(--text-secondary);
    }

    /* Modal styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-container {
      background: var(--surface);
      border-radius: 12px;
      width: 100%;
      max-width: 500px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      animation: fadeIn 0.3s ease-out;
    }

    .modal-header {
      padding: 1.5rem;
      border-bottom: 1px solid rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .modal-header h3 {
      margin: 0;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: var(--text-secondary);
    }

    .modal-body {
      padding: 1.5rem;
    }

    .modal-footer {
      padding-top: 1rem;
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .camps-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .camp-card {
      background: var(--surface);
      border-radius: 12px;
      padding: 1.5rem;
      border: 1px solid var(--glass-border);
      transition: all 0.3s ease;
    }

    .camp-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.5rem;
    }

    .camp-header h4 {
      margin: 0;
      font-size: 1.25rem;
    }

    .resident-count {
      font-size: 0.875rem;
      color: var(--text-secondary);
      background: var(--surface);
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
    }

    .camp-location {
      color: var(--text-secondary);
      font-size: 0.875rem;
      margin-bottom: 1rem;
    }

    .camp-capacity {
      margin-bottom: 1.5rem;
    }

    .capacity-bar {
      height: 6px;
      background: var(--surface);
      border-radius: 3px;
      margin-bottom: 0.5rem;
      overflow: hidden;
    }

    .capacity-fill {
      height: 100%;
      background: #229954;
      border-radius: 3px;
      transition: width 0.3s ease;
    }

    .capacity-fill.near-full {
      background: #e74c3c;
    }

    .capacity-text {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .camp-actions {
      display: flex;
      gap: 0.75rem;
    }

    .btn-sm {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
    }

    .pointer {
      cursor: pointer;
    }

    @media (max-width: 1200px) {
      .dashboard-content {
        grid-template-columns: 250px 1fr;
        gap: 1.5rem;
      }

      .camps-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      }
    }

    @media (max-width: 992px) {
      .dashboard-content {
        padding: 1.5rem 1rem;
      }

      .dashboard-header h1 {
        font-size: 1.75rem;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .dashboard-content {
        grid-template-columns: 1fr;
        padding: 1rem;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .camps-grid {
        grid-template-columns: 1fr;
      }

      .action-buttons {
        flex-wrap: wrap;
      }

      .btn {
        width: 100%;
      }

      .dashboard-header {
        padding: 1.5rem 0;
      }

      .dashboard-header h1 {
        font-size: 1.5rem;
      }

      .modal-container {
        margin: 1rem;
      }
    }

    @media (max-width: 576px) {
      .dashboard-content {
        padding: 0.75rem;
      }

      .card {
        padding: 1rem;
      }

      .profile-avatar {
        width: 60px;
        height: 60px;
        font-size: 1.25rem;
      }

      .profile-actions {
        flex-direction: column;
      }

      .profile-actions .btn {
        width: 100%;
      }

      .camp-card {
        padding: 1rem;
      }

      .camp-actions {
        flex-direction: column;
      }

      .camp-actions .btn {
        width: 100%;
      }

      .modal-header {
        padding: 1rem;
      }

      .modal-body {
        padding: 1rem;
      }

      .modal-footer {
        flex-direction: column;
        gap: 0.5rem;
      }

      .modal-footer .btn {
        width: 100%;
      }
    }

    @media (max-width: 360px) {
      .dashboard-header h1 {
        font-size: 1.25rem;
      }

      .stat-card {
        padding: 1rem;
      }

      .stat-icon {
        font-size: 1.5rem;
      }

      .stat-content h3 {
        font-size: 1.25rem;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser: any = null;
  posts: any[] = [];
  camps: Camp[] = [];
  members: any[] = [];
  postCount = 0;
  campCount = 0;
  memberCount = 0;
  forumPostCount = 0;
  showEditProfile = false;
  profileForm = {
    fullName: '',
    phone: '',
    skills: ''
  };

  constructor(
    private authService: AuthService,
    private postService: PostService,
    private campService: ReliefCampService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUserData();
  }

  async loadUserData() {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.profileForm = {
        fullName: this.currentUser.full_name,
        phone: this.currentUser.phone || '',
        skills: this.currentUser.skills || ''
      };
      await this.loadData();
    }
  }

  async loadData() {
    try {
      // Load camps with resident counts
      const camps = await this.campService.getCamps(this.currentUser.user_id);
      this.camps = await Promise.all(camps.map(async (camp: Camp) => {
        const residents = await this.campService.getResidents(camp.id);
        return {
          ...camp,
          resident_count: residents.length
        };
      }));
      
      this.campCount = this.camps.length;

      // Load recent posts
      // const posts = await this.postService.getPosts(this.currentUser.user_id);
      // this.posts = posts;
      // this.postCount = posts.length;

      // Calculate total members helped
      this.memberCount = this.camps.reduce((total, camp) => total + (camp.resident_count || 0), 0);

      // Load forum posts count
      const { data: forumPosts, error: forumError } = await this.authService.supabase
        .from('forum_posts')
        .select('id', { count: 'exact' });

      if (forumError) {
        console.error('Error loading forum posts count:', forumError);
      } else {
        this.forumPostCount = forumPosts?.length || 0;
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }

  getInitials(name: string): string {
    if (!name) return '';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
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

  getCapacityPercentage(camp: Camp): number {
    if (!camp.capacity || !camp.resident_count) return 0;
    return Math.min((camp.resident_count / camp.capacity) * 100, 100);
  }

  async updateProfile() {
    if (!this.currentUser) return;

    try {
      const { data, error } = await this.authService.supabase
        .from('volunteer_profiles')
        .update({
          full_name: this.profileForm.fullName,
          phone: this.profileForm.phone,
          skills: this.profileForm.skills
        })
        .eq('user_id', this.currentUser.user_id);

      if (error) throw error;

      // Reload user data
      await this.authService.loadUser();
      this.showEditProfile = false;
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  }

  logout() {
    this.authService.logout();
  }

  async navigateToResidentForm() {
    try {
      // Get the first camp or the camp with the lowest occupancy
      const camps = await this.campService.getCamps(this.currentUser.user_id);
      if (camps && camps.length > 0) {
        // Sort camps by occupancy rate
        const campsWithResidents = await Promise.all(camps.map(async (camp: Camp) => {
          const residents = await this.campService.getResidents(camp.id);
          return {
            ...camp,
            occupancyRate: camp.capacity ? (residents.length / camp.capacity) : 1
          };
        }));
        
        // Sort by occupancy rate and get the camp with lowest occupancy
        const targetCamp = campsWithResidents.sort((a, b) => a.occupancyRate - b.occupancyRate)[0];
        
        // Navigate to the resident form for the selected camp
        this.router.navigate(['/volunteer/camps', targetCamp.id, 'residents', 'new']);
      } else {
        // If no camps exist, redirect to camp creation
        this.router.navigate(['/volunteer/camps/new']);
      }
    } catch (error) {
      console.error('Error navigating to resident form:', error);
      // Fallback to camps list
      this.router.navigate(['/volunteer/camps']);
    }
  }
}