// import { Injectable } from '@angular/core';
// import { createClient, SupabaseClient } from '@supabase/supabase-js';
// import { BlogPost, Comment } from '../models/blog.model';

// @Injectable({
//   providedIn: 'root'
// })
// export class BlogService {
//   private supabase: SupabaseClient;

//   constructor() {
//     this.supabase = createClient(
//       import.meta.env.VITE_SUPABASE_URL,
//       import.meta.env.VITE_SUPABASE_ANON_KEY
//     );
//   }

//   async getPosts() {
//     const { data, error } = await this.supabase
//       .from('blog_posts')
//       .select(`
//         *,
//         volunteers (name)
//       `)
//       .order('created_at', { ascending: false });
    
//     if (error) throw error;
//     return data;
//   }

//   async createPost(content: string, authorId: string) {
//     const { data, error } = await this.supabase
//       .from('blog_posts')
//       .insert([{ content, author_id: authorId }])
//       .select();
    
//     if (error) throw error;
//     return data;
//   }

//   async likePost(postId: string) {
//     const { error } = await this.supabase.rpc('increment_likes', { post_id: postId });
//     if (error) throw error;
//   }

//   async getComments(postId: string) {
//     const { data, error } = await this.supabase
//       .from('comments')
//       .select(`
//         *,
//         volunteers (name)
//       `)
//       .eq('post_id', postId)
//       .order('created_at', { ascending: true });
    
//     if (error) throw error;
//     return data;
//   }

//   async addComment(postId: string, content: string, authorId: string) {
//     const { data, error } = await this.supabase
//       .from('comments')
//       .insert([{
//         post_id: postId,
//         content,
//         author_id: authorId
//       }])
//       .select();
    
//     if (error) throw error;
//     return data;
//   }
// }