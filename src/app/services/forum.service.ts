import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ForumService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }
  async fetchCampUpdates(): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from('camp_updates')
        .select('u_id, content, volunteer_id, created_at, title, camp_name')
        .order('created_at', { ascending: false });
      if (error) throw new Error('Error fetching camp updates: ' + error.message);
      return data || [];
    } catch (error) {
      console.error('Error in fetchCampUpdates:', error);
      throw error;
    }
  }

  // Add new camp update
  
}
