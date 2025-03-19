import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CampService {
  private supabase: SupabaseClient;

  constructor(private router: Router) {
    // Initialize Supabase client
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey,
      {
        auth: { persistSession: true } // Enable session persistence for auth
      }
    );
  }

  // Check if user is authenticated and is a volunteer
  async checkVolunteerAccess(): Promise<boolean> {
    try {
      console.log('Checking volunteer access...');
      const { data: { session }, error: authError } = await this.supabase.auth.getSession();
      
      if (authError) {
        console.error('Auth error while checking volunteer access:', authError);
        return false;
      }

      if (!session) {
        console.log('No active session found');
        return false;
      }

      console.log('Session details:', {
        id: session.user.id,
        email: session.user.email,
        role: session.user.role
      });
      
      console.log('Querying volunteers table...');
      const { data: volunteerData, error: volunteerError } = await this.supabase
        .from('volunteer_profiles')
        .select('user_id, full_name')
        .eq('user_id', session.user.id)
        .single();

      if (volunteerError) {
        console.error('Error querying volunteers table:', volunteerError);
        console.error('Error details:', volunteerError.details, volunteerError.hint, volunteerError.message);
        return false;
      }

      const isVolunteer = volunteerData !== null;
      console.log('Volunteer query result:', volunteerData);
      console.log('Is volunteer:', isVolunteer);
      return isVolunteer;
    } catch (error) {
      console.error('Error checking volunteer access:', error);
      return false;
    }
  }


  async submitCamp(campData: {
    name: string;
    location: string;
    capacity: number;
    contact: number;
  }) {
    try {
      // Check if user is authenticated and is a volunteer
      const isVolunteer = await this.checkVolunteerAccess();
      if (!isVolunteer) {
        this.router.navigate(['/login']);
        throw new Error('Only volunteers can submit reports. Please login as a volunteer.');
      }

      // Get the current user's ID
      const { data: { session } } = await this.supabase.auth.getSession();
      if (!session) {
        throw new Error('Authentication required');
      }

      const { data, error } = await this.supabase
        .from('camps')
        .insert([{
          ...campData,
          user_id: session.user.id, // Add the user_id to the report
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to submit report: ${error.message}`);
      }

      return data;
    } catch (error: any) {
      console.error('Error submitting report:', error);
      throw error;
    }
  }
  async getAllCamps(user_id: any) {
    try {
      const { data, error } = await this.supabase.from('camps').select('*');
  
      if (error) {
        throw new Error(`Failed to fetch camps: ${error.message}`);
      }
  
      return data;
    } catch (error: any) {
      console.error('Error fetching camps:', error);
      throw error;
    }
  }
  async getCamps(){
    try {
      const { data, error } = await this.supabase.from('camps').select('*');
  
      if (error) {
        throw new Error(`Failed to fetch camps: ${error.message}`);
      }
  
      return data;
    } catch (error: any) {
      console.error('Error fetching camps:', error);
      throw error;
    }
  }
  
  async getCampById(campId: string) {
    try {
      const { data, error } = await this.supabase.from('camps').select('*').eq('id', campId).single();
  
      if (error) {
        throw new Error(`Failed to fetch camp: ${error.message}`);
      }
  
      return data;
    } catch (error: any) {
      console.error('Error fetching camp:', error);
      throw error;
    }
  }
  async deleteCamp(campId: string) {
    try {
      const { error } = await this.supabase.from('camps').delete().eq('id', campId);
  
      if (error) {
        throw new Error(`Failed to delete camp: ${error.message}`);
      }
  
      console.log(`Camp with ID ${campId} deleted successfully`);
    } catch (error: any) {
      console.error('Error deleting camp:', error);
      throw error;
    }
  }
  

}
