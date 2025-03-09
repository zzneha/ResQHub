import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <!-- Brand Section -->
          <div class="brand-section">
            <a routerLink="/" class="brand-link">
              <mat-icon class="brand-icon">emergency</mat-icon>
              <span class="brand-name">ResQHub</span>
            </a>
            <p class="brand-description">Enhancing community resilience through effective disaster response and recovery.</p>
            <div class="social-links">
              <a href="#" class="social-link">
                <mat-icon>facebook</mat-icon>
              </a>
              <a href="#" class="social-link">
                <mat-icon>twitter</mat-icon>
              </a>
              <a href="#" class="social-link">
                <mat-icon>instagram</mat-icon>
              </a>
            </div>
          </div>

          <!-- Quick Links Section -->
          <div class="footer-section">
            <h3 class="footer-heading">Quick Links</h3>
            <ul class="footer-links">
              <li>
                <a routerLink="/about" class="footer-link">
                  <mat-icon class="link-icon">arrow_right</mat-icon>
                  <span>About Us</span>
                </a>
              </li>
              <li>
                <a routerLink="/blog" class="footer-link">
                  <mat-icon class="link-icon">arrow_right</mat-icon>
                  <span>Blog</span>
                </a>
              </li>
              <li>
                <a routerLink="/contact" class="footer-link">
                  <mat-icon class="link-icon">arrow_right</mat-icon>
                  <span>Contact</span>
                </a>
              </li>
            </ul>
          </div>

          <!-- Resources Section -->
          <div class="footer-section">
            <h3 class="footer-heading">Resources</h3>
            <ul class="footer-links">
              <li>
                <a routerLink="/training" class="footer-link">
                  <mat-icon class="link-icon">school</mat-icon>
                  <span>Training</span>
                </a>
              </li>
              <li>
                <a routerLink="/volunteer" class="footer-link">
                  <mat-icon class="link-icon">volunteer_activism</mat-icon>
                  <span>Volunteer</span>
                </a>
              </li>
              <li>
                <a routerLink="/faq" class="footer-link">
                  <mat-icon class="link-icon">help_outline</mat-icon>
                  <span>FAQs</span>
                </a>
              </li>
            </ul>
          </div>

          <!-- Emergency Section -->
          <div class="footer-section">
            <h3 class="footer-heading">Emergency</h3>
            <ul class="footer-links">
              <li>
                <a routerLink="/report" class="footer-link emergency-link">
                  <mat-icon class="emergency-icon">warning</mat-icon>
                  <span>Report Incident</span>
                </a>
              </li>
              <li>
                <a routerLink="/shelters" class="footer-link emergency-link">
                  <mat-icon class="emergency-icon">home</mat-icon>
                  <span>Find Shelter</span>
                </a>
              </li>
              <li>
                <a routerLink="/contacts" class="footer-link emergency-link">
                  <mat-icon class="emergency-icon">phone_in_talk</mat-icon>
                  <span>Emergency Contacts</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Newsletter Section -->
        <div class="newsletter-section">
          <div class="newsletter-container">
            <h4 class="newsletter-heading">Subscribe to Our Alerts</h4>
            <div class="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email" 
                class="newsletter-input"
              >
              <button class="newsletter-button">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <!-- Copyright Section -->
        <div class="copyright-section">
          <p class="copyright-text">&copy; {{ currentYear }} ResQHub. All rights reserved.</p>
        </div>
      </div>
    </footer>

    <style>
      .footer {
        background: linear-gradient(to bottom, #1a1a1a, #000000);
        color: #cccccc;
        padding: 60px 0;
      }

      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
      }

      .footer-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 40px;
      }

      .brand-section {
        margin-bottom: 30px;
      }

      .brand-link {
        display: flex;
        align-items: center;
        gap: 10px;
        text-decoration: none;
      }

      .brand-icon {
        color: #229954;
        transition: transform 0.3s;
      }

      .brand-name {
        font-size: 24px;
        font-weight: bold;
        color: white;
        transition: color 0.3s;
      }

      .brand-link:hover .brand-icon {
        transform: scale(1.1) rotate(12deg);
      }

      .brand-link:hover .brand-name {
        color: #229954;
      }

      .brand-description {
        color: #999;
        margin: 20px 0;
        line-height: 1.6;
      }

      .social-links {
        display: flex;
        gap: 20px;
        margin-top: 20px;
      }

      .social-link {
        color: #999;
        transition: color 0.3s, transform 0.3s;
      }

      .social-link:hover {
        color: white;
        transform: scale(1.1);
      }

      .footer-section {
        margin-bottom: 30px;
      }

      .footer-heading {
        color: white;
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 20px;
        position: relative;
        padding-bottom: 10px;
      }

      .footer-heading::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 40px;
        height: 2px;
        background-color: #229954;
      }

      .footer-links {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .footer-link {
        display: flex;
        align-items: center;
        gap: 10px;
        color: #999;
        text-decoration: none;
        margin-bottom: 15px;
        transition: color 0.3s;
      }

      .footer-link:hover {
        color: white;
      }

      .link-icon {
        font-size: 18px;
        transition: color 0.3s;
      }

      .footer-link:hover .link-icon {
        color: #229954;
      }

      .emergency-link {
        color: #999;
      }

      .emergency-icon {
        color: #229954;
      }

      .emergency-link:hover {
        color: #229954;
      }

      .newsletter-section {
        border-top: 1px solid #333;
        margin-top: 40px;
        padding-top: 40px;
      }

      .newsletter-container {
        max-width: 500px;
        margin: 0 auto;
        text-align: center;
      }

      .newsletter-heading {
        color: white;
        font-size: 20px;
        margin-bottom: 20px;
      }

      .newsletter-form {
        display: flex;
        gap: 10px;
      }

      .newsletter-input {
        flex: 1;
        padding: 12px 16px;
        border-radius: 6px;
        border: 1px solid #333;
        background-color: rgba(51, 51, 51, 0.5);
        color: white;
        transition: all 0.3s;
      }

      .newsletter-input:focus {
        outline: none;
        border-color: #229954;
        box-shadow: 0 0 0 2px rgba(34, 153, 84, 0.2);
      }

      .newsletter-button {
        padding: 12px 24px;
        background-color: #229954;
        color: white;
        border: none;
        border-radius: 6px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s;
      }

      .newsletter-button:hover {
        background-color: #1a7441;
        transform: scale(1.05);
      }

      .copyright-section {
        border-top: 1px solid #333;
        margin-top: 40px;
        padding-top: 20px;
        text-align: center;
      }

      .copyright-text {
        color: #666;
        font-size: 14px;
      }

      /* Responsive Design */
      @media (max-width: 768px) {
        .footer-grid {
          grid-template-columns: 1fr;
        }

        .footer-section {
          margin-top: 30px;
        }

        .newsletter-form {
          flex-direction: column;
        }

        .newsletter-button {
          width: 100%;
        }
      }
    </style>
  `
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
} 