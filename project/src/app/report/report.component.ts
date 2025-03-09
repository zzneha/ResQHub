import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-report-incident',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="report-container">
      <div class="report-card card">
        <div class="report-header">
          <h2>Report an Incident</h2>
          <p>Help us respond quickly to emergencies</p>
        </div>
        
        <form class="report-form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label class="form-label">Incident Type</label>
            <select 
              class="form-input"
              [(ngModel)]="formData.type"
              name="type"
              required>
              <option value="">Select incident type</option>
              <option value="natural">Natural Disaster</option>
              <option value="fire">Fire</option>
              <option value="medical">Medical Emergency</option>
              <option value="security">Security Incident</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Location</label>
            <input 
              type="text" 
              class="form-input"
              [(ngModel)]="formData.location"
              name="location"
              placeholder="Enter address or coordinates"
              required>
          </div>

          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea 
              class="form-input"
              [(ngModel)]="formData.description"
              name="description"
              rows="4"
              required></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Upload Images</label>
            <input 
              type="file" 
              class="form-input file-input"
              (change)="onFileSelected($event)"
              accept="image/*"
              multiple>
          </div>

          <div class="form-group">
            <label class="form-label">Contact Information</label>
            <input 
              type="text" 
              class="form-input"
              [(ngModel)]="formData.contact"
              name="contact"
              placeholder="Your phone number or email"
              required>
          </div>

          <div class="form-group">
            <label class="form-label">Urgency Level</label>
            <select 
              class="form-input"
              [(ngModel)]="formData.urgency"
              name="urgency"
              required>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <button type="submit" class="btn btn-primary w-full">
            Submit Report
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .report-container {
      min-height: calc(100vh - 72px);
      padding: 2rem;
      animation: fadeIn 0.5s ease-out;
      background: linear-gradient(135deg, var(--background) 0%, var(--primary-light) 100%);
    }

    .report-card {
      width: 100%;
      max-width: 720px;
      margin: 0 auto;
      backdrop-filter: blur(10px);
      background: rgba(255, 255, 255, 0.9);
    }

    .report-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .report-header h2 {
      font-size: 1.875rem;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
    }

    .report-header p {
      color: var(--text-secondary);
    }

    .file-input {
      padding: 0.5rem;
    }

    textarea.form-input {
      resize: vertical;
      min-height: 100px;
    }

    @media (prefers-color-scheme: dark) {
      .report-card {
        background: rgba(42, 47, 62, 0.9);
      }
    }
  `]
})
export class ReportComponent {
  formData = {
    type: '',
    location: '',
    description: '',
    contact: '',
    urgency: 'medium'
  };

  selectedFiles: File[] = [];

  onFileSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files);
  }

  onSubmit() {
    console.log('Report incident:', { ...this.formData, files: this.selectedFiles });
    // TODO: Implement report submission logic
  }
}