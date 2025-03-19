import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PostService } from '../services/post.service';
import { AuthService } from '../services/auth.service';
import { VolunteerService } from '../services/volunteer.service';
import { ForumService } from '../services/forum.service';
import { CampService } from '../services/campservice';

@Component({
  selector: 'app-public-forum',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="forum-container">
      <div class="forum-header">
        <div class="container">
          <h1>Community Forum</h1>
          <p>Updates and announcements from our volunteer community</p>
        </div>
      </div>

      <div class="container forum-content">
        <div class="forum-filters">
          <div class="search-box">
            <input type="text" placeholder="Search posts..." (input)="searchPosts($event)">
          </div>
          <div class="sort-options">
            <label>Sort by: </label>
            <select (change)="sortPosts($event)">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        <div *ngIf="isLoading" class="loading-state">
          <div class="spinner"></div>
          <p>Loading community posts...</p>
        </div>

        <div *ngIf="!isLoading && filteredPosts.length === 0" class="empty-state card">
          <div class="empty-icon">🔍</div>
          <h3>No Posts Found</h3>
          <p>There are no posts matching your criteria. Try adjusting your search or check back later.</p>
          <button class="btn btn-primary" (click)="resetFilters()">Reset Filters</button>
        </div>

        <div *ngIf="!isLoading && filteredPosts.length > 0" class="forum-posts">
          <div *ngFor="let post of filteredPosts" class="forum-post card">
            <div class="post-author">
              <div class="author-avatar">
                {{ getInitials(post.volunteer_name) }}
              </div>
              <div class="author-info">
                <h4>{{ post.volunteer_name }}</h4>
                <h3>{{ post.camp_name }}</h3>
                <span class="post-date">{{ formatDate(post.created_at) }}</span>

              </div>
            </div>
            <div class="post-main">
              <h3 class="post-title">{{ post.title }}</h3>
              
              
              <div class="post-content">
                <p [innerHTML]="formatContent(post.content)"></p>
                <button *ngIf="post.content.length > 300" class="read-more" (click)="toggleExpandPost(post)">
                  {{ post.expanded ? 'Show Less' : 'Read More' }}
                </button>
              </div>
            </div>
            
            <!-- <div class="post-actions">
              <button class="action-btn like-btn" [class.active]="isPostLiked(post.id)" (click)="toggleLike(post)">
                <span class="icon">👍</span> {{ post.likes || 0 }}
              </button>
            </div> -->
            
            
              
              <!-- <div *ngIf="currentUser" class="comment-form">
                <textarea placeholder="Write a comment..." [(ngModel)]="post.newComment"></textarea>
                <button class="btn btn-primary" (click)="addComment(post)">Post</button>
              </div>
              <div *ngIf="!currentUser" class="login-to-comment">
                <a [routerLink]="['/login']">Login to comment</a>
              </div> -->
            </div>
          </div>
        </div>
        
        <div *ngIf="!isLoading && hasMorePosts" class="load-more">
          <button class="btn btn-secondary" (click)="loadMorePosts()">Load More</button>
        </div>
      </div>

  `,
  styles: [`
    .forum-container {
      min-height: calc(100vh - 72px);
      background: var(--background);
    }

    .forum-header {
      background: var(--primary);
      color: white;
      padding: 3rem 0;
      text-align: center;
    }

    .forum-header h1 {
      margin-bottom: 0.5rem;
      font-size: 2.5rem;
    }

    .forum-content {
      padding: 2rem 1.5rem;
      max-width: 900px;
      margin: 0 auto;
    }

    .forum-filters {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .search-box input {
      padding: 0.75rem 1rem;
      border: 1px solid var(--border);
      border-radius: 4px;
      width: 300px;
      max-width: 100%;
    }

    .sort-options select {
      padding: 0.75rem 1rem;
      border: 1px solid var(--border);
      border-radius: 4px;
      background: white;
    }

    .forum-posts {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .forum-post {
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .post-author {
      display: flex;
      align-items: center;
      padding: 1rem;
      background: var(--background-alt);
      border-bottom: 1px solid var(--border);
    }

    .author-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--primary);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      margin-right: 1rem;
    }

    .author-info h4 {
      margin: 0;
      font-size: 1rem;
    }

    .post-date {
      font-size: 0.75rem;
      color: var(--text-secondary);
    }

    .post-main {
      padding: 1.5rem;
    }

    .post-title {
      margin-top: 0;
      margin-bottom: 1rem;
      font-size: 1.25rem;
    }

    .post-image {
      margin-bottom: 1rem;
      border-radius: 8px;
      overflow: hidden;
    }

    .post-image img {
      width: 100%;
      max-height: 400px;
      object-fit: cover;
    }

    .post-content {
      margin-bottom: 1rem;
      line-height: 1.6;
    }

    .read-more {
      background: none;
      border: none;
      color: var(--primary);
      cursor: pointer;
      padding: 0;
      font-weight: 500;
    }

    .post-actions {
      display: flex;
      gap: 1rem;
      padding: 0 1.5rem 1.5rem;
      border-bottom: 1px solid var(--border);
    }

    .action-btn {
      background: none;
      border: none;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-secondary);
      cursor: pointer;
      padding: 0.5rem 0.75rem;
      border-radius: 4px;
    }

    .action-btn:hover {
      background: var(--background-alt);
    }

    .action-btn.active {
      color: var(--primary);
    }

    .post-comments {
      padding: 1.5rem;
      background: var(--background-alt);
    }

    .comments-list {
      margin-bottom: 1.5rem;
    }

    .comment {
      padding: 1rem;
      background: white;
      border-radius: 4px;
      margin-bottom: 1rem;
    }

    .comment-author {
      font-weight: 500;
      margin-bottom: 0.25rem;
    }

    .comment-content {
      margin-bottom: 0.5rem;
    }

    .comment-date {
      font-size: 0.75rem;
      color: var(--text-secondary);
    }

    .comment-form textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--border);
      border-radius: 4px;
      margin-bottom: 1rem;
      height: 100px;
      resize: vertical;
    }

    .no-comments, .login-to-comment {
      text-align: center;
      padding: 1rem;
      color: var(--text-secondary);
    }

    .login-to-comment a {
      color: var(--primary);
      text-decoration: none;
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
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 3rem;
      color: var(--text-secondary);
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid rgba(0, 0, 0, 0.1);
      border-radius: 50%;
      border-left-color: var(--primary);
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .load-more {
      text-align: center;
      margin-top: 2rem;
    }

    @media (max-width: 768px) {
      .forum-filters {
        flex-direction: column;
        align-items: stretch;
      }
      
      .search-box input {
        width: 100%;
      }
    }
  `]
})
export class PublicForumComponent implements OnInit {
  allPosts: any[] = [];
  filteredPosts: any[] = [];
  isLoading = true;
  currentUser: any = null;
  searchTerm: string = '';
  sortOption: string = 'newest';
  hasMorePosts = false;
  currentPage = 1;
  postsPerPage = 10;

  constructor(
    private postService: PostService,
    private volunteerService: VolunteerService,
    private forumservice:ForumService,
    private campservice : CampService
  ) {}

  ngOnInit() {
    this.loadPosts();
  }

  async loadPosts(resetPage = true) {
    if (resetPage) {
      this.currentPage = 1;
    }
    
    this.isLoading = true;
    try {
      // Fetch all posts with volunteer information
      const posts = await this.forumservice.fetchCampUpdates();
      // Check if posts exists
        console.log('posts:', posts);// If posts exists, check if data property exists
        if (posts) {
                console.log('posts.data:', posts);
            }
        const postsWithVolunteers = await Promise.all((posts|| []).map(async (post) => {
        const volunteer = await this.volunteerService.getVolunteerById(post.volunteer_id);
        console.log('Volunteer fetched:', volunteer);
        let campName = 'No Camp Assigned';
         if (volunteer?.camp_allocated) {
                const camp = await this.campservice.getCampById(volunteer.camp_allocated);
                campName = camp?.name || 'Unknown Camp';
             }

    
        return {
          ...post,
          volunteer_name: volunteer ? volunteer.full_name : 'Unknown Volunteer',
          camp_name: campName,
        };
      }));
      
      if (resetPage) {
        this.allPosts = postsWithVolunteers;
      } else {
        this.allPosts = [...this.allPosts, ...postsWithVolunteers];
      }
      
    //   this.hasMorePosts = posts.total > this.allPosts.length;
      this.applyFilters();
    } catch (error) {
      console.error('Error loading forum posts:', error);
    } finally {
      this.isLoading = false;
    }
  }

  loadMorePosts() {
    this.currentPage++;
    this.loadPosts(false);
  }

  searchPosts(event: any) {
    this.searchTerm = event.target.value.toLowerCase();
    this.applyFilters();
  }

  sortPosts(event: any) {
    this.sortOption = event.target.value;
    this.applyFilters();
  }

  resetFilters() {
    this.searchTerm = '';
    this.sortOption = 'newest';
    this.applyFilters();
  }

  applyFilters() {
    // Filter posts by search term
    let filtered = this.allPosts;
    if (this.searchTerm) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(this.searchTerm) || 
        post.content.toLowerCase().includes(this.searchTerm) ||
        post.volunteer_name.toLowerCase().includes(this.searchTerm)
      );
    }
    
    // Sort posts based on selected option
    filtered = [...filtered].sort((a, b) => {
      switch (this.sortOption) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'popular':
          return (b.likes || 0) - (a.likes || 0);
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });
    
    this.filteredPosts = filtered;
  }

  getInitials(name: string): string {
    if (!name) return '?';
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    
    // If less than 24 hours ago, show relative time
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHrs = diffMs / (1000 * 60 * 60);
    
    if (diffHrs < 24) {
      if (diffHrs < 1) {
        const diffMins = Math.floor(diffMs / (1000 * 60));
        return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
      }
      const hours = Math.floor(diffHrs);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    // Otherwise show date
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatContent(content: string): string {
    if (!content) return '';
    
    // If the post is expanded, show full content, otherwise truncate
    if (content.length <= 300) {
      return content.replace(/\n/g, '<br>');
    }
    
    const post = this.filteredPosts.find(p => p.content === content);
    if (post && post.expanded) {
      return content.replace(/\n/g, '<br>');
    }
    
    return content.substring(0, 300).replace(/\n/g, '<br>');
  }

  toggleExpandPost(post: any) {
    post.expanded = !post.expanded;
  }  
}