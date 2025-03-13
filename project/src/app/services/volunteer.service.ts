import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { EmailService } from './email.service';

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

  constructor(private emailService: EmailService) {
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

      // Send welcome email using Resend
      await this.emailService.sendVolunteerWelcomeEmail(
        data.email,
        data.fullName
      );

      // Insert into email queue table for tracking
      const { error: queueError } = await this.supabase
        .from('email_queue')
        .insert({
          recipient_email: data.email,
          recipient_name: data.fullName,
          status: 'sent',
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