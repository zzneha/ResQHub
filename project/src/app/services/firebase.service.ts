import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private app;
  private functions;

  constructor() {
    this.app = initializeApp(environment.firebase);
    this.functions = getFunctions(this.app);
  }

  async sendEmailWithGoogleForm(data: { 
    fullName: string; 
    email: string; 
    phone: string;
    reason: string;
  }) {
    try {
      const sendEmail = httpsCallable(this.functions, 'sendVolunteerEmail');
      await sendEmail({
        toName: data.fullName,
        toEmail: data.email,
        googleFormUrl: environment.googleFormUrl
      });
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email with Google Form link');
    }
  }
} 