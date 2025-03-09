import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public supabase: SupabaseClient;
  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private router: Router) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    this.loadUser();
    this.initializeAuthListener();
  }

  /** ✅ Initialize authentication state listener */
  private initializeAuthListener() {
    this.supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        this.loadUserProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        this.currentUserSubject.next(null);
      }
    });
  }

  /** ✅ Load the current user session */
  async loadUser() {
    const { data } = await this.supabase.auth.getSession();
    if (data.session?.user) {
      await this.loadUserProfile(data.session.user.id);
    }
  }

  /** ✅ Load the user profile from the database */
  async loadUserProfile(userId: string) {
    const { data, error } = await this.supabase
      .from('volunteer_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error loading user profile:', error);
      return;
    }

    if (data) {
      const authData = await this.supabase.auth.getUser();
      const user = { ...data, email: authData.data.user?.email || '' };
      this.currentUserSubject.next(user);
    }
  }

  async login(email: string, password: string) {
  const { data, error } = await this.supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    console.error("Login Error:", error.message); // 🔍 Debug here
    throw error;
  }

  if (data.user) {
    console.log("User logged in:", data.user); // 🔍 Debug here
    await this.loadUserProfile(data.user.id);
    this.router.navigate(['/volunteer/dashboard']);
  }

  return data;
}


  /** ✅ Register method */
  async register(email: string, password: string, profileData: any) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      throw error;
    }

    if (!data.user) {
      throw new Error('User creation failed');
    }

    // Create profile in the database
    const { error: profileError } = await this.supabase
      .from('volunteer_profiles')
      .insert({
        user_id: data.user.id,
        full_name: profileData.fullName,
        phone: profileData.phone,
        skills: profileData.skills
      });

    if (profileError) {
      throw profileError;
    }

    await this.loadUserProfile(data.user.id);
    this.router.navigate(['/volunteer/dashboard']);
    return data;
  }

  /** ✅ Update user profile */
  async updateUserProfile(userId: string, profileData: any) {
    const { error } = await this.supabase
      .from('volunteer_profiles')
      .update(profileData)
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    await this.loadUserProfile(userId);
  }

  /** ✅ Logout method */
  async logout() {
    await this.supabase.auth.signOut();
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  /** ✅ Get current user */
  getCurrentUser() {
    return this.currentUserSubject.value;
  }

  /** ✅ Check if user is logged in */
  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }
}