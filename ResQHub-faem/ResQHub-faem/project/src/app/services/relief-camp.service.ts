import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

interface Resident {
  id?: string;
  camp_id: string;
  full_name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  contact_number?: string;
  medical_conditions?: string;
  family_members: number;
  arrival_date: string;
  special_needs?: string;
  status: 'active' | 'relocated' | 'departed';
}

@Injectable({
  providedIn: 'root'
})
export class ReliefCampService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  async getCamps(volunteerId?: string) {
    let query = this.supabase
      .from('camps')
      .select('*');
    
    if (volunteerId) {
      query = query.eq('volunteer_id', volunteerId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data;
  }

  async getCampById(id: string) {
    const { data, error } = await this.supabase
      .from('camps')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  }

  async createCamp(camp: any) {
    const { data, error } = await this.supabase
      .from('camps')
      .insert(camp)
      .select();
    
    if (error) {
      throw error;
    }
    
    return data[0];
  }

  async updateCamp(id: string, updates: any) {
    const { data, error } = await this.supabase
      .from('camps')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) {
      throw error;
    }
    
    return data[0];
  }

  async deleteCamp(id: string) {
    const { error } = await this.supabase
      .from('camps')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    return true;
  }

  async getCampMembers(campId: string) {
    const { data, error } = await this.supabase
      .from('camp_residents')
      .select('*')
      .eq('camp_id', campId);
    
    if (error) {
      throw error;
    }
    
    return data;
  }

  async addCampMember(member: any) {
    const { data, error } = await this.supabase
      .from('camp_residents')
      .insert(member)
      .select();
    
    if (error) {
      throw error;
    }
    
    return data[0];
  }

  async updateCampMember(id: string, updates: any) {
    const { data, error } = await this.supabase
      .from('camp_residents')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) {
      throw error;
    }
    
    return data[0];
  }

  async deleteCampMember(id: string) {
    const { error } = await this.supabase
      .from('camp_residents')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    return true;
  }

  async searchPerson(query: string) {
    const { data, error } = await this.supabase
      .from('camp_residents')
      .select('*, camps(name, location)')
      .or(`full_name.ilike.%${query}%, contact_number.ilike.%${query}%`);
    
    if (error) {
      throw error;
    }
    
    return data;
  }

  async getResidents(campId: string) {
    const { data, error } = await this.supabase
      .from('camp_residents')
      .select('*')
      .eq('camp_id', campId)
      .order('arrival_date', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data;
  }

  async getResidentById(id: string) {
    const { data, error } = await this.supabase
      .from('camp_residents')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  }

  async addResident(resident: Resident) {
    const { data, error } = await this.supabase
      .from('camp_residents')
      .insert([{ ...resident, camp_id: resident.camp_id }]);
  
    if (error) {
      console.error('Error adding resident:', error);
      throw error;
    }
  
    return data;
  }
  

  async updateResident(id: string, updates: Partial<Resident>) {
    const { data, error } = await this.supabase
      .from('camp_residents')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) {
      throw error;
    }
    
    return data[0];
  }

  async deleteResident(id: string) {
    const { error } = await this.supabase
      .from('camp_residents')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    return true;
  }

  async searchResidents(query: string, campId?: string) {
    let dbQuery = this.supabase
      .from('camp_residents')
      .select('*, camps(name, location)')
      .or(`full_name.ilike.%${query}%, contact_number.ilike.%${query}%`);
    
    if (campId) {
      dbQuery = dbQuery.eq('camp_id', campId);
    }
    
    const { data, error } = await dbQuery;
    
    if (error) {
      throw error;
    }
    
    return data;
  }

  async getCampStatistics(campId: string) {
    const { data, error } = await this.supabase
      .from('camp_residents')
      .select('status, count(*)')
      .eq('camp_id', campId)
    ;
    
    if (error) {
      throw error;
    }
    
    return data;
  }
}