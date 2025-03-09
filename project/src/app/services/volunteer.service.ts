import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

interface VolunteerRegistration {
  fullName: string;
  email: string;
  phone: string;
  reason: string;
}

@Injectable({
  providedIn: 'root'
})
export class VolunteerService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  async registerVolunteer(data: VolunteerRegistration) {
    try {
      // First save to Supabase
      const { data: result, error: insertError } = await this.supabase
        .from('volunteer_registrations')
        .insert(data)
        .select();
      
      if (insertError) throw insertError;

      // Then trigger email using Supabase's built-in email service
      const { error: emailError } = await this.supabase.auth.admin.createUser({
        email: data.email,
        email_confirm: true,
        user_metadata: {
          full_name: data.fullName
        }
      });

      if (emailError) throw emailError;

      // Insert into email queue table for tracking
      const { error: queueError } = await this.supabase
        .from('email_queue')
        .insert({
          recipient_email: data.email,
          recipient_name: data.fullName,
          status: 'pending',
          template: 'volunteer_registration'
        });

      if (queueError) throw queueError;
      
      return result[0];
    } catch (error: any) {
      console.error('Error in registration process:', error);
      throw error;
    }
  }
} 