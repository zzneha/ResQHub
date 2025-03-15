import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  from(arg0: string) {
    throw new Error('Method not implemented.');
  }
  private supabaseClient: SupabaseClient;

  constructor() {
    this.supabaseClient = createClient(
      environment.supabaseUrl,
      environment.supabaseKey,
      {
        auth: {
          persistSession: true
        }
      }
    );
  }

  get client(): SupabaseClient {
    return this.supabaseClient;
  }

  async insertSubscription(email: string): Promise<{ error: any }> {
    return await this.supabaseClient
      .from('email_subscriptions')
      .insert([
        { 
          email,
          subscribed_at: new Date().toISOString(),
          status: 'active'
        }
      ]);
  }
} 