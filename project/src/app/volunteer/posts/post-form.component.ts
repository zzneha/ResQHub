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
      <div class="post-form-header">
        <div class="container">
          <h1>{{ isEditMode ? 'Edit Post' : 'Create New Post' }}</h1>
          <p>{{ isEditMode ? 'Update your existing post' : 'Share important updates with the community' }}</p>
        </div>
      </div>

      <div class="container post-form-content">
        <div class="post-form-card card">
          <form (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label class="form-label">Title</label>
              <input 
                type="text" 
                class="form-input"
                [(ngModel)]="postForm.title"
                name="title"
                required>
            </div>

            <div class="form-group">
              <label class="form-label">Content</label>
              <textarea 
                class="form-input"
                [(ngModel)]="postForm.content"
                name="content"
                rows="6"
                required></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Image</label>
              <div *ngIf="postForm.imageUrl" class="image-preview">
                <img [src]="postForm.imageUrl" alt="Post image">
                <button type="button" class="remove-image" (click)="removeImage()">×</button>
              </div>
              <input 
                *ngIf="!postForm.imageUrl"
                type="file" 
                class="form-input file-input"
                (change)="onFileSelected($event)"
                accept="image/*">
            </div>

            <div *ngIf="errorMessage" class="error-message">
              {{ errorMessage }}
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-secondary" routerLink="/volunteer/posts">Cancel</button>
              <button type="submit" class="btn btn-primary" [disabled]="isLoading">
                {{ isLoading ? 'Saving...' : (isEditMode ? 'Update Post' : 'Create Post') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .post-form-container {
      min-height: calc(100vh - 72px);
      background: var(--background);
    }

    .post-form-header {
      background: #229954;
      color: white;
      padding: 2rem 0;
    }

    .post-form-header h1 {
      margin-bottom: 0.5rem;
      font-size: 2rem;
    }

    .post-form-content {
      padding: 2rem 1.5rem;
    }

    .post-form-card {
      max-width: 800px;
      margin: 0 auto;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
    }

    .file-input {
      padding: 0.75rem;
    }

    .image-preview {
      position: relative;
      margin-bottom: 1rem;
      border-radius: 8px;
      overflow: hidden;
      max-width: 300px;
    }

    .image-preview img {
      width: 100%;
      height: auto;
      display: block;
    }

    .remove-image {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: rgba(0,0,0,0.5);
      color: white;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      cursor: pointer;
      transition: background 0.3s ease;
    }

    .remove-image:hover {
      background: rgba(0,0,0,0.7);
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
  `]
})
export class PostFormComponent implements OnInit {
  isEditMode = false;
  postId: string | null = null;
  isLoading = false;
  errorMessage = '';
  selectedFile: File | null = null;
  
  postForm = {
    title: '',
    content: '',
    imageUrl: ''
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
      const post = posts.find(p => p.id === id);
      
      if (post) {
        this.postForm = {
          title: post.title,
          content: post.content,
          imageUrl: post.image_url || ''
        };
      } else {
        this.errorMessage = 'Post not found';
        setTimeout(() => {
          this.router.navigate(['/volunteer/posts']);
        }, 2000);
      }
    } catch (error) {
      console.error('Error loading post:', error);
      this.errorMessage = 'Failed to load post';
    }
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  removeImage() {
    this.postForm.imageUrl = '';
    this.selectedFile = null;
  }

  async onSubmit() {
    if (!this.postForm.title || !this.postForm.content) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      let imageUrl = this.postForm.imageUrl;
      
      // Upload image if selected
      if (this.selectedFile) {
        imageUrl = await this.postService.uploadImage(this.selectedFile);
      }
      
      if (this.isEditMode && this.postId) {
        // Update existing post
        await this.postService.updatePost(this.postId, {
          title: this.postForm.title,
          content: this.postForm.content,
          image_url: imageUrl
        });
      } else {
        // Create new post
        await this.postService.createPost({
          volunteer_id: this.authService.getCurrentUser().user_id,
          title: this.postForm.title,
          content: this.postForm.content,
          image_url: imageUrl
        });
      }
      
      this.router.navigate(['/volunteer/posts']);
    } catch (error) {
      console.error('Error saving post:', error);
      this.errorMessage = 'Failed to save post. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }
}