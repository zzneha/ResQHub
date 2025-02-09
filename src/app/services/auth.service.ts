import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;

  constructor() {
    // Use the environment variables from a different approach
    const SUPABASE_URL = process.env['VITE_SUPABASE_URL'] || '';
    const SUPABASE_ANON_KEY = process.env['VITE_SUPABASE_ANON_KEY'] || '';
    
    this.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  async getSession() {
    const { data, error } = await this.supabase.auth.getSession();
    if (error) throw error;
    return data; // Ensure this returns the correct type
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  }

  async signUp(email: string, password: string, userData: any) {
    // First create the user in auth
    const { data: authData, error: authError } = await this.supabase.auth.signUp({
      email,
      password
    });
    
    if (authError) throw authError;

    // Then create the volunteer profile
    if (authData.user) {
      const { error: profileError } = await this.supabase
        .from('volunteers')
        .insert([
          {
            id: authData.user.id,
            email: email,
            name: userData.name,
            phone: userData.phone,
            skills: userData.skills
          }
        ]);
      
      if (profileError) throw profileError;
    }

    return authData;
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  generatePassword() {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  }
}
