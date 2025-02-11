// footer.component.ts
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, MatIconModule, CommonModule],
  template: `
    <footer class="bg-gray-900 text-gray-300">
      <div class="container mx-auto px-4 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <a routerLink="/" class="flex items-center space-x-2 mb-4 hover:opacity-80 transition-opacity">
              <mat-icon class="text-red-500 transform transition-transform hover:scale-110">emergency</mat-icon>
              <span class="text-xl font-bold text-white">ResQHub</span>
            </a>
            <p class="text-sm">Enhancing community resilience through effective disaster response and recovery.</p>
            <!-- Added social links -->
            <div class="flex space-x-4 mt-4">
              <a href="#" class="hover:text-white transition-colors">
                <mat-icon class="text-sm">facebook</mat-icon>
              </a>
              <a href="#" class="hover:text-white transition-colors">
                <mat-icon class="text-sm">twitter</mat-icon>
              </a>
              <a href="#" class="hover:text-white transition-colors">
                <mat-icon class="text-sm">instagram</mat-icon>
              </a>
            </div>
          </div>

          <!-- Quick Links Section with hover animations -->
          <div>
            <h3 class="text-white font-semibold mb-4">Quick Links</h3>
            <ul class="space-y-2">
              <li>
                <a routerLink="/about" class="hover:text-white transition-colors flex items-center space-x-2">
                  <mat-icon class="text-sm">arrow_right</mat-icon>
                  <span>About Us</span>
                </a>
              </li>
              <li>
                <a routerLink="/blog" class="hover:text-white transition-colors flex items-center space-x-2">
                  <mat-icon class="text-sm">arrow_right</mat-icon>
                  <span>Blog</span>
                </a>
              </li>
              <li>
                <a routerLink="/contact" class="hover:text-white transition-colors flex items-center space-x-2">
                  <mat-icon class="text-sm">arrow_right</mat-icon>
                  <span>Contact</span>
                </a>
              </li>
            </ul>
          </div>

          <!-- Resources Section with hover animations -->
          <div>
            <h3 class="text-white font-semibold mb-4">Resources</h3>
            <ul class="space-y-2">
              <li>
                <a routerLink="/training" class="hover:text-white transition-colors flex items-center space-x-2">
                  <mat-icon class="text-sm">school</mat-icon>
                  <span>Training</span>
                </a>
              </li>
              <li>
                <a routerLink="/volunteer" class="hover:text-white transition-colors flex items-center space-x-2">
                  <mat-icon class="text-sm">volunteer_activism</mat-icon>
                  <span>Volunteer</span>
                </a>
              </li>
              <li>
                <a routerLink="/faq" class="hover:text-white transition-colors flex items-center space-x-2">
                  <mat-icon class="text-sm">help_outline</mat-icon>
                  <span>FAQs</span>
                </a>
              </li>
            </ul>
          </div>

          <!-- Emergency Section with enhanced styling -->
          <div>
            <h3 class="text-white font-semibold mb-4">Emergency</h3>
            <ul class="space-y-2">
              <li>
                <a routerLink="/report" class="hover:text-red-400 transition-colors flex items-center space-x-2">
                  <mat-icon class="text-red-500">warning</mat-icon>
                  <span>Report Incident</span>
                </a>
              </li>
              <li>
                <a routerLink="/shelters" class="hover:text-red-400 transition-colors flex items-center space-x-2">
                  <mat-icon class="text-red-500">home</mat-icon>
                  <span>Find Shelter</span>
                </a>
              </li>
              <li>
                <a routerLink="/contacts" class="hover:text-red-400 transition-colors flex items-center space-x-2">
                  <mat-icon class="text-red-500">phone_in_talk</mat-icon>
                  <span>Emergency Contacts</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Newsletter Subscription -->
        <div class="border-t border-gray-800 mt-8 pt-8">
          <div class="max-w-md mx-auto text-center mb-8">
            <h4 class="text-white font-semibold mb-4">Subscribe to Our Alerts</h4>
            <div class="flex space-x-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                class="flex-1 px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
              <button class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <!-- Copyright with dynamic year -->
        <div class="border-t border-gray-800 mt-8 pt-8 text-center">
          <p class="text-sm">&copy; {{ currentYear }} ResQHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}