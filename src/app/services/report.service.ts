import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
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

  private async uploadSingleImage(file: File): Promise<string> {
    try {
      // First check if user is a volunteer
      const isVolunteer = await this.checkVolunteerAccess();
      if (!isVolunteer) {
        throw new Error('Only volunteers can upload images');
      }

      if (!file) {
        throw new Error('File object is undefined.');
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error(`Invalid file type for ${file.name}. Only images are allowed.`);
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error(`File ${file.name} is too large. Maximum size is 5MB.`);
      }

      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const uniqueFileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `incident_images/${uniqueFileName}`; // Store in correct folder

      // Upload file
      const { data: uploadData, error: uploadError } = await this.supabase.storage
        .from('incident')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false // Prevent overwriting
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(`Error uploading file ${file.name}: ${uploadError.message}`);
      }

      // Get the public URL
      const { data } = this.supabase.storage
        .from('incident')
        .getPublicUrl(filePath);

      if (!data) {
        throw new Error('Failed to retrieve public URL');
      }

      return data.publicUrl;
    } catch (error) {
      console.error('Upload error details:', error);
      throw error;
    }
  }

  async uploadImages(files: File[]): Promise<string[]> {
    try {
      if (!files || files.length === 0) {
        return [];
      }

      const uploadPromises = files.map(file => this.uploadSingleImage(file));
      const imageUrls = await Promise.all(uploadPromises);

      return imageUrls;
    } catch (error: any) {
      console.error('Error uploading images:', error);
      throw new Error(`Failed to upload images: ${error.message}`);
    }
  }

  async submitReport(reportData: {
    type: string;
    location: string;
    description: string;
    contact: string;
    urgency: string;
    images: string[];
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
        .from('reports')
        .insert([{
          ...reportData,
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
 
  async getAllReports(): Promise<Report[]> {
    const { data, error } = await this.supabase.from('reports').select('*');
    if (error) throw new Error('Failed to fetch reports');
  
    return data.map((report) => ({
      ...report,
      location: typeof report.location === 'string' ? JSON.parse(report.location) : report.location,
      imageUrl: report.images || 'assets/default-image.jpg', // Ensure fallback works
    }));
  }
  
  
}
