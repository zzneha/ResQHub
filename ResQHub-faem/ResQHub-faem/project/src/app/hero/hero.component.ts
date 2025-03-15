import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="hero">
      <div class="container hero-content">
        <div class="hero-text glass">
          <h1 class="animated-title">
            <span>Empowering</span>
            <span>Communities</span>
          </h1>
          <p class="animated-text">Swift, efficient disaster management and response. Be prepared, stay connected, save lives.</p>
          <div class="hero-buttons">
            <a routerLink="/volunteer/register" class="btn btn-primary glass-hover">Get Started →</a>
            <a routerLink="/about" class="btn btn-secondary glass-hover">Learn More</a>
          </div>
        </div>
        <div class="hero-image glass">
          <img [src]="currentImage" alt="Disaster Response Hero" (load)="onImageLoad()">
        </div>
      </div>

      <div class="features glass">
        <div class="container">
          <div class="features-grid">
            <div class="feature-card glass glass-hover" *ngFor="let feature of features">
              <div class="feature-icon">{{feature.icon}}</div>
              <h3>{{feature.title}}</h3>
              <p>{{feature.description}}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      min-height: calc(100vh - 72px);
      padding: 6rem 0 0;
      position: relative;
    }

    .hero-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;
      margin-bottom: 8rem;
    }

    .hero-text {
      padding: 3rem;
      border-radius: 24px;
    }

    .animated-title {
      font-size: 4rem;
      font-weight: 700;
      line-height: 1.2;
      margin-bottom: 1.5rem;
      display: flex;
      flex-direction: column;
      background: transparent;
      
    }

    .animated-title span {
  display: inline;
  
  background: transparent;
  color: black;
  transform: translateX(-100px);
  opacity: 0;
  animation: slideIn 0.5s forwards;
}


    .animated-title span:nth-child(2) {
      animation-delay: 0.2s;
    }

    .animated-text {
      font-size: 1.25rem;
      margin-bottom: 2rem;
      opacity: 0;
      transform: translateY(20px);
      animation: fadeIn 0.5s 0.4s forwards;
      line-height: 1.6;
      color: rgb(44, 21, 21);
    }

    .hero-buttons {
      display: flex;
      gap: 1rem;
      opacity: 0;
      transform: translateY(20px);
      animation: fadeIn 0.5s 0.6s forwards;
    }
    .hero-image {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 24px;
    overflow: hidden;
    transform: translateY(20px);
    opacity: 0;
    animation: fadeIn 0.5s 0.8s forwards;
    width: 100%; /* Ensures it takes full width */
    height: auto; /* Maintains aspect ratio */
}

.hero-image img {
    width: 100%; /* Ensures it fits container */
    height: auto; /* Maintains original aspect ratio */
    object-fit: contain; /* Prevents cropping */
    display: block;
    transition: transform 0.3s ease;
}

.hero-image:hover img {
    transform: scale(1.05);
}


//     .hero-image {
//       border-radius: 24px;
//       overflow: hidden;
//       transform: translateY(20px);
//       opacity: 0;
//       animation: fadeIn 0.5s 0.8s forwards;
//     }

//     .hero-image img {
//       width: 100%;
//       height: auto;
//       display: block;
//       transition: transform 0.3s ease;
//     }
  
// }


//     .hero-image:hover img {
//       transform: scale(1.05);
//     }

    .features {
      padding: 4rem 0;
      border-radius: 24px;
      margin: 0 1.5rem;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
    }

    .feature-card {
      padding: 2rem;
      border-radius: 16px;
      transition: transform 0.3s ease;
      background: rgb(255, 255, 255);
      border: 1px solid rgba(34, 153, 84, 0.1);
    }

    .feature-card:hover {
      transform: translateY(-5px);
      background: rgb(255, 255, 255);
      border-color: rgba(34, 153, 84, 0.2);
    }

    .feature-icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      color: #C41230;
    }

    .feature-card h3 {
      margin-bottom: 0.5rem;
      color: #C41230;
    }

    .feature-card p {
      color: var(--text-secondary);
      line-height: 1.6;
    }

    .btn-primary {
      background: #C41230;
      color: white;
      border: none;
      transition: all 0.3s ease;
    }

    .btn-primary:hover {
      background: #C41230;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(34, 153, 84, 0.2);
    }

    .btn-secondary {
      background: rgba(253, 255, 254, 0.38);
      color: #C41230;
      border: 1px solid rgb(194, 16, 16);
      transition: all 0.3s ease;
    }

    .btn-secondary:hover {
      background: rgb(255, 255, 255);
      border-color: rgb(255, 255, 255);
      transform: translateY(-1px);
    }

    @media (max-width: 768px) {
      .hero-content {
        grid-template-columns: 1fr;
        text-align: center;
        gap: 2rem;
      }

      .animated-title {
        font-size: 3rem;
      }

      .hero-buttons {
        justify-content: center;
      }

      .features {
        margin: 0;
        border-radius: 0;
      }
    }
  `]
})
export class HeroComponent implements OnInit, OnDestroy {
  features = [
    {
      icon: '🚨',
      title: 'Real-time Alerts',
      description: 'Instant notifications for emergency situations and critical updates.'
    },
    {
      icon: '👥',
      title: 'Volunteer Network',
      description: 'Connect with dedicated volunteers and coordinate response efforts.'
    },
    {
      icon: '📱',
      title: 'Mobile Response',
      description: 'Access critical information and tools from any device, anywhere.'
    },
    {
      icon: '🎓',
      title: 'Training Module',
      description: 'Comprehensive emergency preparedness training and resources.'
    }
  ];

  supabase: SupabaseClient;
  images: string[] = [];
  currentImage: string = '';
  private currentIndex: number = 0;
  private interval: any;

  constructor() {
    this.supabase = createClient(
      'https://axlxnitgzhjnyyfuvqib.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4bHhuaXRnemhqbnl5ZnV2cWliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg4MTYzMjIsImV4cCI6MjA1NDM5MjMyMn0.3HAqQlvpB9EUp1QZLes6BdXu0ehtg8O1e0qQ5H4ylpQ'
    );
  }

  async ngOnInit() {
    await this.fetchImages();
    if (this.images.length > 0) {
      this.currentImage = this.images[0];
      this.startSlideshow();
    }
  }

  async fetchImages() {
    const { data, error } = await this.supabase
      .from('reports')
      .select('images');

    if (error) {
      console.error('Error fetching images:', error);
    } else {
      this.images = data.map((report: any) => report.images).filter((url: string) => url); // Filter out null/undefined URLs
    }
  }

  startSlideshow() {
    this.interval = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
      this.currentImage = this.images[this.currentIndex];
    }, 5000); // Change image every 5 seconds
  }

  onImageLoad() {
    // Optional: Add any logic you want to execute after an image loads
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}