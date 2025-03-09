import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  async getPosts(user_id: any) {
    const { data, error } = await this.supabase
      .from('posts')
      .select(`
        *,
        volunteer_profiles(full_name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data;
  }

  async getPostsByVolunteer(volunteerId: string) {
    const { data, error } = await this.supabase
      .from('posts')
      .select('*')
      .eq('volunteer_id', volunteerId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data;
  }

  async createPost(post: any) {
    const { data, error } = await this.supabase
      .from('posts')
      .insert(post)
      .select();
    
    if (error) {
      throw error;
    }
    
    return data[0];
  }

  async updatePost(id: string, updates: any) {
    const { data, error } = await this.supabase
      .from('posts')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) {
      throw error;
    }
    
    return data[0];
  }

  async deletePost(id: string) {
    const { error } = await this.supabase
      .from('posts')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    return true;
  }

  async uploadImage(file: File) {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await this.supabase.storage
      .from('post-images')
      .upload(fileName, file);
    
    if (error) {
      throw error;
    }
    
    const { data: urlData } = this.supabase.storage
      .from('post-images')
      .getPublicUrl(data.path);
    
    return urlData.publicUrl;
  }
}