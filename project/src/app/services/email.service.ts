import { Injectable } from '@angular/core';
import { Resend } from 'resend';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(environment.resendApiKey);
  }

  async sendVolunteerWelcomeEmail(to: string, name: string) {
    try {
      const { data, error } = await this.resend.emails.send({
        from: 'ResQHub <notifications@resqhub.com>',
        to: [to],
        subject: 'Welcome to ResQHub - Volunteer Registration Confirmed',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #229954; margin-bottom: 20px;">Welcome to ResQHub!</h1>
            <p>Dear ${name},</p>
            <p>Thank you for registering as a volunteer with ResQHub. Your commitment to helping others during times of crisis is truly appreciated.</p>
            <p>As a volunteer, you now have access to:</p>
            <ul>
              <li>Report incidents and emergencies</li>
              <li>Access training materials</li>
              <li>Coordinate with other volunteers</li>
              <li>View and manage shelter information</li>
            </ul>
            <div style="margin: 30px 0;">
              <a href="${environment.appUrl}/volunteer/dashboard" 
                 style="background-color: #229954; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                Access Your Dashboard
              </a>
            </div>
            <p>If you have any questions, please don't hesitate to contact our support team.</p>
            <p>Best regards,<br>The ResQHub Team</p>
          </div>
        `
      });

      if (error) {
        console.error('Error sending welcome email:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      throw error;
    }
  }

  async sendIncidentReportEmail(to: string, reportData: any) {
    try {
      const { data, error } = await this.resend.emails.send({
        from: 'ResQHub <notifications@resqhub.com>',
        to: [to],
        subject: `Incident Report: ${reportData.type} - Action Required`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #229954; margin-bottom: 20px;">New Incident Report</h1>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #229954; margin-top: 0;">Incident Details</h2>
              <p><strong>Type:</strong> ${reportData.type}</p>
              <p><strong>Location:</strong> ${reportData.location}</p>
              <p><strong>Description:</strong> ${reportData.description}</p>
              <p><strong>Urgency:</strong> ${reportData.urgency}</p>
              <p><strong>Contact:</strong> ${reportData.contact}</p>
            </div>
            <div style="margin: 30px 0;">
              <a href="${environment.appUrl}/reports/${reportData.id}" 
                 style="background-color: #229954; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                View Full Report
              </a>
            </div>
            <p>Please review this report and take appropriate action as soon as possible.</p>
            <p>Best regards,<br>ResQHub Incident Management Team</p>
          </div>
        `
      });

      if (error) {
        console.error('Error sending incident report email:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to send incident report email:', error);
      throw error;
    }
  }

  async sendAlertEmail(to: string[], subject: string, message: string) {
    try {
      const { data, error } = await this.resend.emails.send({
        from: 'ResQHub Alerts <alerts@resqhub.com>',
        to,
        subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #229954; margin-bottom: 20px;">ResQHub Alert</h1>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
              <p>${message}</p>
            </div>
            <p style="margin-top: 20px;">Stay safe and follow official guidelines.</p>
            <p>Best regards,<br>ResQHub Alert System</p>
          </div>
        `
      });

      if (error) {
        console.error('Error sending alert email:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to send alert email:', error);
      throw error;
    }
  }

  async sendSubscriptionConfirmation(to: string, name: string) {
    try {
      const { data, error } = await this.resend.emails.send({
        from: 'ResQHub <notifications@resqhub.com>',
        to: [to],
        subject: 'Welcome to ResQHub Updates',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #229954; margin-bottom: 20px;">Thank You for Subscribing!</h1>
            <p>Dear ${name},</p>
            <p>Thank you for subscribing to ResQHub updates. You'll now receive important notifications about:</p>
            <ul>
              <li>Emergency alerts in your area</li>
              <li>Important safety updates</li>
              <li>Community preparedness tips</li>
              <li>Volunteer opportunities</li>
            </ul>
            <div style="margin: 30px 0;">
              <a href="${environment.appUrl}/preferences" 
                 style="background-color: #229954; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                Manage Your Preferences
              </a>
            </div>
            <p style="margin-top: 20px; font-size: 0.9em; color: #666;">
              You can unsubscribe at any time by clicking <a href="${environment.appUrl}/unsubscribe?email=${to}" style="color: #229954;">here</a>.
            </p>
            <p>Best regards,<br>The ResQHub Team</p>
          </div>
        `
      });

      if (error) {
        console.error('Error sending subscription confirmation:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to send subscription confirmation:', error);
      throw error;
    }
  }

  async sendNewsletterEmail(to: string[], subject: string, content: string) {
    try {
      const { data, error } = await this.resend.emails.send({
        from: 'ResQHub Newsletter <newsletter@resqhub.com>',
        to,
        subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #229954; margin-bottom: 20px;">ResQHub Newsletter</h1>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
              ${content}
            </div>
            <p style="margin-top: 20px; font-size: 0.9em; color: #666;">
              You're receiving this email because you subscribed to ResQHub updates. 
              <a href="${environment.appUrl}/preferences" style="color: #229954;">Manage preferences</a> or 
              <a href="${environment.appUrl}/unsubscribe" style="color: #229954;">unsubscribe</a>.
            </p>
          </div>
        `
      });

      if (error) {
        console.error('Error sending newsletter:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to send newsletter:', error);
      throw error;
    }
  }
} 