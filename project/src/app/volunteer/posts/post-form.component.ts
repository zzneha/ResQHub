import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="post-form-container">
      <div class="container">
        <h1>{{ isEditMode ? 'Edit Post' : 'Create New Post' }}</h1>
        <p>{{ isEditMode ? 'Update your existing post' : 'Share important updates with the community' }}</p>

        <div class="post-form-card card">
          <form (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label class="form-label">Title</label>
              <input
                type="text"
                class="form-input"
                [(ngModel)]="postForm.title"
                name="title"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">Content</label>
              <textarea
                class="form-input"
                [(ngModel)]="postForm.content"
                name="content"
                rows="6"
                required
              ></textarea>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-secondary" routerLink="/volunteer/posts">Cancel</button>
              <button type="submit" class="btn btn-primary" [disabled]="isLoading">
                {{ isLoading ? 'Saving...' : (isEditMode ? 'Update Post' : 'Create Post') }}
              </button>
            </div>

            <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .post-form-container {
        min-height: calc(100vh - 72px);
        background:rgb(55, 55, 55);
        padding: 2rem;
      }

      .form-group {
        margin-bottom: 1rem;
      }

      .form-input {
        width: 100%;
        padding: 0.75rem;
        border-radius: 5px;
        border: 1px solid #ddd;
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-top: 1.5rem;
      }

      .btn-primary {
        background: #229954;
        color: #fff;
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: 0.3s;
      }

      .btn-primary:hover {
        background: #1a7441;
      }

      .btn-secondary {
        background: #ddd;
        color: #333;
      }

      .error-message {
        color: #e74c3c;
        margin-top: 1rem;
      }
      .container{
        color:rgb(0, 0, 0)
      }
    `,
  ],
})
export class PostFormComponent implements OnInit {
  isEditMode = false;
  postId: string | null = null;
  isLoading = false;
  errorMessage = '';

  postForm = {
    title: '',
    content: '',
  };

  constructor(
    private authService: AuthService,
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.postId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.postId;

    if (this.isEditMode && this.postId) {
      this.loadPost(this.postId);
    }
  }

  async loadPost(id: string) {
    try {
      const posts = await this.postService.getPostsByVolunteer(this.authService.getCurrentUser().user_id);
      const post = posts.find((p) => p.id === id);

      if (post) {
        this.postForm = {
          title: post.title,
          content: post.content,
        };
      } else {
        this.errorMessage = 'Post not found';
        setTimeout(() => this.router.navigate(['/volunteer/posts']), 2000);
      }
    } catch (error) {
      console.error('Error loading post:', error);
      this.errorMessage = 'Failed to load post';
    }
  }

  async onSubmit() {
    if (!this.postForm.title || !this.postForm.content) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      if (this.isEditMode && this.postId) {
        // Update existing post
        await this.postService.updatePost(this.postId, {
          title: this.postForm.title,
          content: this.postForm.content,
        });
      } else {
        // Create new post in `camp_updates` table
        await this.postService.createPost({
          volunteer_id: this.authService.getCurrentUser().user_id,
          title: this.postForm.title,
          content: this.postForm.content,
        });
      }

      this.router.navigate(['/volunteer/forum']);
    } catch (error) {
      console.error('Error saving post:', error);
      this.errorMessage = 'Failed to save post. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }
}
