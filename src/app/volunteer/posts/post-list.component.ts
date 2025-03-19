import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="posts-container">
      <div class="posts-header">
        <div class="container">
          <h1>My Posts</h1>
          <p>Manage your public updates and announcements</p>
        </div>
      </div>

      <div class="container posts-content">
        <div class="posts-actions">
          <a routerLink="/volunteer/posts/new" class="btn btn-primary">Create New Post</a>
        </div>

        <div *ngIf="isLoading" class="loading-state">
          <p>Loading posts...</p>
        </div>

        <div *ngIf="!isLoading && posts.length === 0" class="empty-state card">
          <div class="empty-icon">📝</div>
          <h3>No Posts Yet</h3>
          <p>Share updates, news, and important information with the community.</p>
          <a routerLink="/volunteer/posts/new" class="btn btn-primary">Create Your First Post</a>
        </div>

        <div *ngIf="!isLoading && posts.length > 0" class="posts-grid">
          <div *ngFor="let post of posts" class="post-card card">
            <div class="post-header">
              <h3>{{ post.title }}</h3>
              <div class="post-date">{{ formatDate(post.created_at) }}</div>
            </div>
            
            <div *ngIf="post.image_url" class="post-image">
              <img [src]="post.image_url" alt="{{ post.title }}">
            </div>
            
            <div class="post-content">
              <p>{{ truncateText(post.content, 150) }}</p>
            </div>
            
            <div class="post-actions">
              <a [routerLink]="['/volunteer/posts/edit', post.id]" class="btn btn-secondary">Edit</a>
              <button class="btn btn-danger" (click)="deletePost(post.id)">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .posts-container {
      min-height: calc(100vh - 72px);
      background: var(--background);
    }

    .posts-header {
      background: var(--primary);
      color: white;
      padding: 2rem 0;
    }

    .posts-header h1 {
      margin-bottom: 0.5rem;
      font-size: 2rem;
    }

    .posts-content {
      padding: 2rem 1.5rem;
    }

    .posts-actions {
      margin-bottom: 2rem;
      display: flex;
      justify-content: flex-end;
    }

    .posts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .post-card {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .post-header {
      margin-bottom: 1rem;
    }

    .post-header h3 {
      margin-bottom: 0.5rem;
    }

    .post-date {
      font-size: 0.75rem;
      color: var(--text-secondary);
    }

    .post-image {
      margin-bottom: 1rem;
      border-radius: 8px;
      overflow: hidden;
    }

    .post-image img {
      width: 100%;
      height: 180px;
      object-fit: cover;
    }

    .post-content {
      flex-grow: 1;
      margin-bottom: 1.5rem;
    }

    .post-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: auto;
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
      .posts-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class PostListComponent implements OnInit {
  posts: any[] = [];
  isLoading = true;
  currentUser: any = null;

  constructor(
    private authService: AuthService,
    private postService: PostService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadPosts();
      }
    });
  }

  async loadPosts() {
    this.isLoading = true;
    try {
      this.posts = await this.postService.getPostsByVolunteer(this.currentUser.user_id);
    } catch (error) {
      console.error('Error loading posts:', error);
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

  async deletePost(id: string) {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await this.postService.deletePost(id);
      this.posts = this.posts.filter(post => post.id !== id);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  }
}