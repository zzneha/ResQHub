import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PostService {
 
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async createPost(postData: { volunteer_id: string; title: string; content: string; camp_name: string }) {
    const { data, error } = await this.supabase.from('camp_updates').insert([postData]);

    if (error) {
      console.error('Error creating post:', error);
      throw error;
    }

    return data;
  }

  async updatePost(id: string, postData: { title: string; content: string }) {
    const { data, error } = await this.supabase.from('camp_updates').update(postData).eq('id', id);

    if (error) {
      console.error('Error updating post:', error);
      throw error;
    }

    return data;
  }

  async getPostsByVolunteer(volunteerId: string) {
    const { data, error } = await this.supabase.from('camp_updates').select('*').eq('volunteer_id', volunteerId);

    if (error) {
      console.error('Error loading posts:', error);
      throw error;
    }

    return data;
  }

  async deletePost(id: string) {
    const { error } = await this.supabase.from('camp_updates').delete().eq('id', id);
    if (error) throw error;
  }

  async getPostById(id: string) {
    const { data, error } = await this.supabase.from('camp_updates').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  }

  async getPostsByCamp(campName: string) {
    const { data, error } = await this.supabase.from('camp_updates').select('*').eq('camp_name', campName);
    if (error) throw error;
    return data;
  }

  async getPosts(user_id: string) {
    const { data, error } = await this.supabase.from('camp_updates').select('*').eq('volunteer_id', user_id);
    if (error) {
      console.error('Error retrieving posts:', error);
      throw error;
    }
    return data;
  }
}
