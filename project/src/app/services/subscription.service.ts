import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  constructor(private supabaseService: SupabaseService) {}

  // ✅ Subscribe a user
  async subscribe(email: string): Promise<void> {
    try {
      const { data, error } = await this.supabaseService.client
        .from('email_subscriptions')
        .insert([{ email }]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          throw new Error('This email is already subscribed');
        }
        throw new Error('Failed to subscribe. Please try again later.');
      }
    } catch (error: any) {
      console.error('Subscription error:', error);
      throw new Error(error.message || 'Failed to subscribe. Please try again later.');
    }
  }

  // ✅ Unsubscribe a user
  async unsubscribe(email: string): Promise<boolean> {
    try {
      const { data, error } = await this.supabaseService.client
        .from('email_subscriptions')
        .update({ is_active: false })
        .eq('email', email)
        .select()
        .single();

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error unsubscribing:', error);
      throw error;
    }
  }

  // ✅ Get subscription status
  async getSubscriptionStatus(email: string) {
    try {
      const { data, error } = await this.supabaseService.client
        .from('email_subscriptions')
        .select('email, is_active, preferences')
        .eq('email', email)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting subscription status:', error);
      throw error;
    }
  }

  // ✅ Get all active subscribers
  async getAllActiveSubscribers() {
    try {
      const { data, error } = await this.supabaseService.client
        .from('email_subscriptions')
        .select('email')
        .eq('is_active', true);

      if (error) throw error;

      return data.map((subscriber: { email: string }) => subscriber.email);
    } catch (error) {
      console.error('Error getting active subscribers:', error);
      throw error;
    }
  }
}
