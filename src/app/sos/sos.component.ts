import { Component, OnInit } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Volunteer {
  user_id: string;
  full_name: string;
  phone: string;
}

@Component({
    standalone:true,
  selector: 'app-sos',
  imports:[FormsModule,CommonModule],
  template:  `<div class="sos-container">
  <h1>Emergency Contacts</h1>
  <p class="description">In case of an emergency, contact the following services or volunteers:</p>

  <!-- Loading State -->
  <div *ngIf="isLoading" class="loading-spinner">
    Loading emergency contacts...
  </div>

  <!-- Error Message -->
  <div *ngIf="errorMessage" class="error-message">
    {{ errorMessage }}
  </div>

  <!-- Emergency Services -->
  <div class="emergency-services">
    <h2>Emergency Services</h2>
    <div *ngFor="let service of emergencyServices" class="contact-card">
      <span class="service-name">{{ service.name }}</span>
      <a class="contact-number" href="tel:{{ service.contact_number }}">
        {{ service.contact_number }}
      </a>
    </div>
  </div>

  <!-- Volunteers -->
  <div class="volunteers">
    <h2>Volunteers</h2>
    <div *ngFor="let volunteer of volunteers" class="contact-card">
      <span class="volunteer-name">{{ volunteer.full_name }}</span>
      <a class="contact-number" href="tel:{{ volunteer.phone }}">
        {{ volunteer.phone }}
      </a>
    </div>
  </div>
</div> `,
  styles: [`.sos-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    font-family: Arial, sans-serif;
  }
  
  h1 {
    text-align: center;
    color: #72383d;
    margin-bottom: 1rem;
  }
  
  .description {
    text-align: center;
    color: #6b6b6b;
    margin-bottom: 2rem;
  }
  
  .loading-spinner {
    text-align: center;
    font-size: 1.25rem;
    color: #322d29;
  }
  
  .error-message {
    text-align: center;
    color: #e74c3c;
    background: rgba(231, 76, 60, 0.1);
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 2rem;
  }
  
  .emergency-services, .volunteers {
    margin-bottom: 2rem;
  }
  
  h2 {
    color: #72383d;
    margin-bottom: 1rem;
  }
  
  .contact-card {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 1rem;
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  
  .contact-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .service-name, .volunteer-name {
    font-weight: bold;
    color: #322d29;
  }
  
  .contact-number {
    color: #72383d;
    text-decoration: none;
    font-weight: 500;
  }
  
  .contact-number:hover {
    text-decoration: underline;
  }
  `]
})
export class SosComponent implements OnInit {
  emergencyServices: { name: string; contact_number: string }[] = [
    { name: 'Police', contact_number: '100' },
    { name: 'Fire Rescue', contact_number: '101' },
    { name: 'Ambulance', contact_number: '102' },
    { name: 'Disaster Management', contact_number: '1070' },
    { name: 'Women Helpline', contact_number: '1091' },
    { name: 'Child Helpline', contact_number: '1098' },
    { name: 'Kerala Emergency', contact_number: '112' },
  ];

  volunteers: Volunteer[] = [];
  isLoading = true;
  errorMessage = '';

  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async ngOnInit() {
    try {
      // Fetch volunteers' contact numbers from Supabase
      const { data, error } = await this.supabase
        .from('volunteer_profiles') // Replace with your table name
        .select('user_id, full_name, phone')
        .order('full_name', { ascending: true });

      if (error) {
        throw new Error(`Failed to fetch volunteers: ${error.message}`);
      }

      this.volunteers = data || [];
    } catch (error: any) {
      this.errorMessage = 'Failed to load volunteer data. Please try again later.';
      console.error('Error fetching volunteers:', error);
    } finally {
      this.isLoading = false;
    }
  }
}