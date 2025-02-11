// import { Component, OnInit } from '@angular/core';
// import { BlogService } from '../../services/blog.service';
// import { AuthService } from '../../services/auth.service';
// import { BlogPost, Comment } from '../../models/blog.model';
// import { User } from '@supabase/supabase-js';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-blog',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './blog.component.html',
//   styleUrls: ['./blog.component.css']
// })
// export class BlogComponent implements OnInit {
//   posts: BlogPost[] = [];
//   comments = new Map<string, Comment[]>();
//   expandedPost: string | null = null;
//   newPostContent = '';
//   newCommentContent = '';
//   isVolunteer = false;
//   currentUser: User | null = null;

//   constructor(
//     private blogService: BlogService,
//     private authService: AuthService
//   ) {}

//   async ngOnInit() {
//     await this.loadPosts();
//     const { data } = await this.authService.getSession();
//     const user = data.session?.user || null;

//     this.currentUser = user;
//     this.isVolunteer = !!this.currentUser;
//   }

//   async loadPosts() {
//     try {
//       this.posts = await this.blogService.getPosts();
//     } catch (error) {
//       console.error('Error loading posts:', error);
//     }
//   }

//   async createPost() {
//     if (!this.newPostContent.trim() || !this.currentUser) return;

//     try {
//       await this.blogService.createPost(this.newPostContent, this.currentUser.id);
//       this.newPostContent = '';
//       await this.loadPosts();
//     } catch (error) {
//       console.error('Error creating post:', error);
//     }
//   }

//   async likePost(postId: string) {
//     try {
//       await this.blogService.likePost(postId);
//       await this.loadPosts();
//     } catch (error) {
//       console.error('Error liking post:', error);
//     }
//   }

//   async toggleComments(postId: string) {
//     if (this.expandedPost === postId) {
//       this.expandedPost = null;
//       return;
//     }

//     this.expandedPost = postId;
//     try {
//       const comments = await this.blogService.getComments(postId);
//       this.comments.set(postId, comments);
//     } catch (error) {
//       console.error('Error loading comments:', error);
//     }
//   }

//   async addComment(postId: string) {
//     if (!this.newCommentContent.trim() || !this.currentUser) return;

//     try {
//       await this.blogService.addComment(
//         postId,
//         this.newCommentContent,
//         this.currentUser.id
//       );
//       this.newCommentContent = '';
//       await this.toggleComments(postId);
//     } catch (error) {
//       console.error('Error adding comment:', error);
//     }
//   }
// }
