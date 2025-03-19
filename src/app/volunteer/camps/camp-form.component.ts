// import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, NgZone } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { FormsModule } from '@angular/forms';
// import { AuthService } from '../../services/auth.service';
// import { ReliefCampService } from '../../services/relief-camp.service';
// import { CommonModule ,NgIf } from '@angular/common';
// import  mapboxgl from 'mapbox-gl';
// import { LocationResult, MapboxService } from '../../services/mapbox.service';

// interface LocationData {
//   address: string;
//   latitude: number;
//   longitude: number;
// }
// @Component({
//   selector: 'app-camp-form',
//   standalone: true,
//   imports: [FormsModule , CommonModule ],
//   template: `
//     <div class="camp-form-container">
//       <div class="camp-form-content">
//         <div class="camp-form-card card">
//           <form (ngSubmit)="onSubmit()">
//             <div class="form-group">
//               <label class="form-label">Camp Name</label>
//               <input 
//                 type="text" 
//                 class="form-input"
//                 [(ngModel)]="formData.name"
//                 name="name"
//                 required
//                 [disabled]="isLoading">
//             </div>

//             <div class="form-group">
//               <label class="form-label">Location</label>
//               <div class="input-wrapper">
//                 <span class="input-icon">📍</span>
//                 <input 
//                   type="text" 
//                   class="form-input"
//                   [(ngModel)]="locationSearch"
//                   name="locationSearch"
//                   placeholder="Search for a location"
//                   (input)="onLocationSearch($event)">
//               </div>
//               <div class="map-container">
//                 <div #mapElement class="map"></div>
//                 <div class="map-info" *ngIf="selectedLocation">
//                   <p>Selected Location:</p>
//                   <p>{{selectedLocation.address}}</p>
//                   <p>Lat: {{selectedLocation.latitude}}, Lng: {{selectedLocation.longitude}}</p>
//                 </div>
//               </div>
//             </div>
//             <div class="form-group">
//           <label class="form-label">Capacity</label>
//            <input 
//               type="number" 
//               class="form-input"
//               [(ngModel)]="formData.capacity"
//               name="capacity"
//               required
//               min="1"
//               [disabled]="isLoading">
//               </div>


//              <!-- Mapbox Map -->

//             <div class="form-actions">
//               <button type="button" class="btn btn-secondary" routerLink="/volunteer/camps">Cancel</button>
//               <button type="submit" class="btn btn-primary" [disabled]="isLoading">
//                 {{ isLoading ? 'Saving...' : (isEditMode ? 'Update Camp' : 'Create Camp') }}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   `,
//   styles: [`
//     .camp-form-container {
//       min-height: calc(100vh - 72px);
//       background: var(--background);
//     }

//     .camp-form-content {
//       padding: 2rem 1.5rem;
//     }

//     .camp-form-card {
//       max-width: 800px;
//       margin: 0 auto;
//       padding: 2rem;
//       background: white;
//       border-radius: 12px;
//       box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
//     }

//     .form-group {
//       margin-bottom: 1.5rem;
//     }

//     .form-label {
//       font-weight: bold;
//       display: block;
//       margin-bottom: 0.5rem;
//     }

//     .form-input {
//       width: 100%;
//       padding: 0.75rem;
//       border: 1px solid #ccc;
//       border-radius: 8px;
//       font-size: 1rem;
//       transition: border-color 0.2s ease-in-out;
//     }

//     .form-input:focus {
//       border-color: var(--primary);
//       outline: none;
//     }

//     .map-container {
//       width: 100%;
//       height: 350px;
//       border-radius: 12px;
//       box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
//       margin-top: 10px;
//     }

//     .form-actions {
//       display: flex;
//       justify-content: flex-end;
//       gap: 1rem;
//       margin-top: 2rem;
//     }

//     .btn {
//       padding: 0.75rem 1.5rem;
//       border-radius: 8px;
//       font-size: 1rem;
//       cursor: pointer;
//       border: none;
//     }

//     .btn-primary {
//       background: var(--primary);
//       color: white;
//       font-weight: bold;
//       transition: background 0.2s ease-in-out;
//     }

//     .btn-primary:hover {
//       background: darken(var(--primary), 10%);
//     }

//     .btn-secondary {
//       background: #ccc;
//       color: black;
//     }
//   `]
// })

// export class CampFormComponent implements OnInit, AfterViewInit {
//   @ViewChild('mapElement') mapElement!: ElementRef<HTMLElement>;

//   isEditMode = false;
//   campId: string | null = null;
//   isLoading = false;
//   errorMessage = '';

//   selectedLocation: LocationData | null = null;
//   locationSearch = '';
//   private map: mapboxgl.Map | null = null;
//   private marker: mapboxgl.Marker | null = null;
//   private searchTimeout: any;

//   formData = {
//     name: '',
//     location: {
//       address: '',
//       latitude: 0,
//       longitude: 0
//     } as LocationData,
//     capacity: null as number | null
//   };

//   //map!: mapboxgl.Map;
//   //marker!: mapboxgl.Marker;
//   mapError = '';

//   constructor(
//     private authService: AuthService,
//     private campService: ReliefCampService,
//     private mapboxService: MapboxService,
//     private route: ActivatedRoute,
//     private router: Router,
//     private ngZone: NgZone
//   ) {}

//   async ngOnInit() {
//     this.campId = this.route.snapshot.paramMap.get('id');
//     this.isEditMode = !!this.campId;

//     if (this.isEditMode && this.campId) {
//       this.loadCamp(this.campId);
//     }

//     // Get user's current location
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         async (position) => {
//           const coords: [number, number] = [position.coords.longitude, position.coords.latitude];
//           if (this.map) {
//             this.map.setCenter(coords);
//             this.map.setZoom(13);
//             this.updateMarker(coords);
//             const address = await this.mapboxService.reverseGeocode(coords[0], coords[1]);
//             this.updateSelectedLocation(address, position.coords.latitude, position.coords.longitude);
//           }
//         },
//         () => {
//           console.log('Error: The Geolocation service failed.');
//         }
//       );
//     }
//   }
//   loadCamp(campId: string) {
//     throw new Error('Method not implemented.');
//   }

//   async ngAfterViewInit() {
//     try {
//       this.map = await this.mapboxService.initializeMap(this.mapElement.nativeElement);
      
//       this.map.on('click', async (event) => {
//         const coords = event.lngLat;
//         this.updateMarker([coords.lng, coords.lat]);
//         const address = await this.mapboxService.reverseGeocode(coords.lng, coords.lat);
//         this.updateSelectedLocation(address, coords.lat, coords.lng);
//       });

//     } catch (error) {
//       this.mapError = 'Failed to initialize map. Please refresh the page and try again.';
//       console.error('Error initializing map:', error);
//     }
//   }

//   private updateMarker(coords: [number, number]) {
//     if (this.marker) {
//       this.marker.remove();
//     }

//     this.marker = new mapboxgl.Marker({
//       color: '#72383d',
//       draggable: true
//     })
//       .setLngLat(coords)
//       .addTo(this.map!);

//       this.marker.on('dragend', async () => {
//         const position = this.marker!.getLngLat();
//         const address = await this.mapboxService.reverseGeocode(position.lng, position.lat);
//         this.updateSelectedLocation(address, position.lat, position.lng);
//       });
//   }

//   private updateSelectedLocation(address: string, lat: number, lng: number) {
//     this.ngZone.run(() => {
//       this.selectedLocation = { address, latitude: lat, longitude: lng };
//       this.formData.location = this.selectedLocation;
//       this.locationSearch = address;
//     });
//   }

//   async onLocationSearch(event: Event) {
//     const query = (event.target as HTMLInputElement).value;
    
//     if (this.searchTimeout) {
//       clearTimeout(this.searchTimeout);
//     }

//     if (!query) return;

//     this.searchTimeout = setTimeout(async () => {
//       const result: LocationResult | null = await this.mapboxService.searchLocation(query);
//       if (result) {
//         const [lng, lat] = result.coordinates;
//         if (this.map) {
//           this.map.setCenter(result.coordinates);
//           this.map.setZoom(15);
//           if (result.bounds) {
//             this.map.fitBounds(result.bounds, { padding: 50 });
//           }
//         }
//         this.updateMarker([lng, lat]);
//         this.updateSelectedLocation(result.address, lat, lng);
//       }
//     }, 500);
//   }

//   async onSubmit() {
//     if (!this.formData.name || !this.formData.location || !this.formData.capacity) {
//       this.errorMessage = 'Please fill in all required fields';
//       return;
//     }
//     this.isLoading = true;
//     this.errorMessage = '';

//     try {
//       if (this.isEditMode && this.campId) {
//         await this.campService.updateCamp(this.campId, this.formData);
//       } else {
//         await this.campService.createCamp({
//           volunteer_id: this.authService.getCurrentUser().user_id,
//           ...this.formData
//         });
//       }
//       this.router.navigate(['/volunteer/camps']);
//     } catch (error) {
//       console.error('Error saving camp:', error);
//       this.errorMessage = 'Failed to save camp. Please try again.';
//     } finally {
//       this.isLoading = false;
//     }
//   }
// }


import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MapboxService } from '../../services/mapbox.service';
import { Router } from '@angular/router';
import mapboxgl from 'mapbox-gl';
import { CampService } from '../../services/campservice'
import { AuthService } from '../../services/auth.service';

interface LocationData {
  address: string;
  latitude: number;
  longitude: number;
}

@Component({
  selector: 'app-camp-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="report-container">
      <div class="report-background">
        <div class="animated-scene">
          <div class="satellite"></div>
          <div class="truck truck-1"></div>
          <div class="truck truck-2"></div>
          <div class="factory"></div>
          <div class="houses"></div>
          <div class="earth"></div>
        </div>
      </div>

      <div class="content-wrapper">
        <div class="report-card glass">
          <div class="card-header">
            <h1>Add New Camp</h1>
          </div>
          
          <form class="report-form" (ngSubmit)="onSubmit()">
          <div class="form-group">
             <label class="form-label">Camp Name</label>
              <input 
                 type="text" 
                 class="form-input"
                [(ngModel)]="formData.name"
                name="name"                 required
                [disabled]="isLoading">
            </div>

            <div class="form-group">
              <label class="form-label">Location</label>
              <div class="input-wrapper">
                <span class="input-icon">📍</span>
                <input 
                  type="text" 
                  class="form-input"
                  [(ngModel)]="locationSearch"
                  name="locationSearch"
                  placeholder="Search for a location"
                  (input)="onLocationSearch($event)">
              </div>
              <div class="map-container">
                <div #mapElement class="map"></div>
                <div class="map-info" *ngIf="selectedLocation">
                  <p>Selected Location:</p>
                  <p>{{selectedLocation.address}}</p>
                  <p>Lat: {{selectedLocation.latitude.toFixed(6)}}, Lng: {{selectedLocation.longitude.toFixed(6)}}</p>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Capacity</label>
              <div class="input-wrapper">
                <span class="input-icon">📝</span>
                <textarea 
                  class="form-input"
                  [(ngModel)]="formData.capacity"
                  name="capacity"
                  placeholder="Enter the capacity of the camp"
                  required></textarea>
              </div>
            </div>

           
            <div class="form-group">
              <label class="form-label">Contact Information</label>
              <div class="input-wrapper">
                <span class="input-icon">📞</span>
                <input 
                  type="text" 
                  class="form-input"
                  [(ngModel)]="formData.contact"
                  name="contact"
                  placeholder="Your phone number or email"
                  required>
              </div>
            </div>

        
            <div *ngIf="errorMessage" class="error-message">
              {{ errorMessage }}
            </div>

            <div *ngIf="successMessage" class="success-message">
              {{ successMessage }}
            </div>

            <div *ngIf="mapError" class="error-message map-error">
              {{ mapError }}
            </div>

            <button type="submit" class="btn btn-primary w-full" [disabled]="isLoading">
              <span *ngIf="isLoading" class="loading-spinner"></span>
              {{ isLoading ? 'Submitting...' : 'Submit Camp' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .report-container {
      min-height: 100vh;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #efe9e1;
      padding: 2rem 0;
    }

    .report-background {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      z-index: 0;
    }

    .animated-scene {
      position: relative;
      width: 100%;
      height: 100%;
    }

    .earth {
      position: absolute;
      bottom: -40%;
      left: -10%;
      width: 120%;
      height: 120%;
      border-radius: 50%;
      background: #72383d;
      transform: rotate(-15deg);
    }

    .satellite {
      position: absolute;
      top: 20%;
      right: 15%;
      width: 60px;
      height: 40px;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%23d9d9d9" d="M21 8.5c0-.83-.67-1.5-1.5-1.5S18 7.67 18 8.5s.67 1.5 1.5 1.5S21 9.33 21 8.5zM4.5 8C3.67 8 3 8.67 3 9.5S3.67 11 4.5 11 6 10.33 6 9.5 5.33 8 4.5 8zm9-2.5c0-.83-.67-1.5-1.5-1.5S11 4.67 11 5.5 11.67 7 12.5 7 13.5 6.33 13.5 5.5z"/></svg>');
      animation: float 20s infinite linear;
    }

    .truck {
      position: absolute;
      width: 80px;
      height: 40px;
      background: #ac9cbd;
      border-radius: 8px;
    }

    .truck-1 {
      bottom: 25%;
      left: 20%;
      animation: drive 15s infinite linear;
    }

    .truck-2 {
      bottom: 30%;
      left: 40%;
      animation: drive 12s infinite linear reverse;
    }

    .factory {
      position: absolute;
      bottom: 22%;
      right: 15%;
      width: 120px;
      height: 80px;
      background: #322d29;
    }

    .houses {
      position: absolute;
      bottom: 20%;
      left: 10%;
      width: 200px;
      height: 60px;
      background: #d1c7bd;
    }

    @keyframes float {
      0% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(180deg); }
      100% { transform: translateY(0) rotate(360deg); }
    }

    @keyframes drive {
      from { transform: translateX(0); }
      to { transform: translateX(100vw); }
    }

    .content-wrapper {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    .report-card {
      width: 100%;
      padding: 2.5rem;
      border-radius: 20px;
      background: rgba(209, 199, 189, 0.2);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(172, 156, 189, 0.2);
    }

    .card-header {
      text-align: center;
      margin-bottom: 2.5rem;
      color: #322d29;
    }

    .card-header h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      font-weight: 700;
    }

    .tagline {
      font-size: 1.125rem;
      line-height: 1.6;
      opacity: 0.9;
      color: #322d29;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-label {
      display: block;
      margin-bottom: 0.5rem;
      color: #322d29;
      font-weight: 500;
    }

    .input-wrapper {
      position: relative;
      background: rgba(172, 156, 189, 0.2);
      border-radius: 8px;
      border: 1px solid rgba(172, 156, 189, 0.3);
    }

    .input-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      font-size: 1.25rem;
    }

    .form-input {
      width: 100%;
      padding: 1rem 3rem;
      border: none;
      background: transparent;
      color: #322d29;
      font-size: 1rem;
    }

    textarea.form-input {
      padding: 1rem 3rem;
      min-height: 100px;
      resize: vertical;
    }

    .form-input::placeholder {
      color: rgba(50, 45, 41, 0.6);
    }

    .form-input:focus {
      outline: none;
      box-shadow: 0 0 0 2px rgba(172, 156, 189, 0.5);
    }

    select.form-input {
      appearance: none;
      background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23322d29"><path d="M7 10l5 5 5-5z"/></svg>');
      background-repeat: no-repeat;
      background-position: right 1rem center;
      background-size: 1.5rem;
    }

    select.form-input option {
      background: #d1c7bd;
      color: #322d29;
    }

   

    .error-message {
      color: #72383d;
      margin-bottom: 1rem;
      text-align: center;
      padding: 0.5rem;
      background: rgba(114, 56, 61, 0.1);
      border-radius: 4px;
    }

    .success-message {
      color: #322d29;
      margin-bottom: 1rem;
      text-align: center;
      padding: 0.75rem;
      background: rgba(172, 156, 189, 0.2);
      border-radius: 8px;
      border: 1px solid rgba(172, 156, 189, 0.3);
    }

    
    .loading-spinner {
      display: inline-block;
      width: 1rem;
      height: 1rem;
      margin-right: 0.5rem;
      border: 2px solid rgba(217, 217, 217, 0.3);
      border-radius: 50%;
      border-top-color: #d9d9d9;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .btn-primary {
      background: #72383d;
      color: #d9d9d9;
      border: none;
      border-radius: 8px;
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .btn-primary:hover {
      background: #5a2d31;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(114, 56, 61, 0.2);
    }

    .btn-primary:disabled {
      background: #d9d9d9;
      color: #322d29;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    @media (max-width: 768px) {
      .report-container {
        padding: 1rem 0;
      }

      .content-wrapper {
        padding: 0 1rem;
      }

      .report-card {
        padding: 1.5rem;
      }

      .card-header h1 {
        font-size: 2rem;
      }
    }

    .map-container {
      margin-top: 1rem;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid rgba(172, 156, 189, 0.3);
    }

    .map {
      width: 100%;
      height: 300px;
      background: rgba(217, 217, 217, 0.2);
    }

    .map-info {
      margin-top: 1rem;
      padding: 1rem;
      background: rgba(172, 156, 189, 0.2);
      border-radius: 8px;
      color: #322d29;
    }

    .map-info p {
      margin: 0.25rem 0;
      font-size: 0.875rem;
    }

    .map-error {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(114, 56, 61, 0.9);
      color: #d9d9d9;
      padding: 1rem;
      border-radius: 8px;
      z-index: 10;
    }

    :host ::ng-deep .mapboxgl-ctrl-logo {
      display: none !important;
    }

    :host ::ng-deep .mapboxgl-ctrl-bottom-right {
      display: none;
    }
  `]
})
export class CampFormComponent implements OnInit, AfterViewInit {
  @ViewChild('mapElement') mapElement!: ElementRef<HTMLElement>;

  formData = {
    name: '',
    location: {
      address: '',
      latitude: 0,
      longitude: 0
    } as LocationData,
    contact: 0,
    capacity: 0
  };

  selectedLocation: LocationData | null = null;
  locationSearch = '';
  private map: mapboxgl.Map | null = null;
  private marker: mapboxgl.Marker | null = null;
  private searchTimeout: any;

  selectedFiles: File[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  mapError = '';

  constructor(
    private campService: CampService,
    private mapboxService: MapboxService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  async ngOnInit() {
    // Get user's current location if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords: [number, number] = [position.coords.longitude, position.coords.latitude];
          if (this.map) {
            this.map.setCenter(coords);
            this.map.setZoom(13);
            this.updateMarker(coords);
            const address = await this.mapboxService.reverseGeocode(coords[0], coords[1]);
            this.updateSelectedLocation(address, position.coords.latitude, position.coords.longitude);
          }
        },
        () => {
          console.log('Error: The Geolocation service failed.');
        }
      );
    }
  }

  async ngAfterViewInit() {
    try {
      this.map = await this.mapboxService.initializeMap(this.mapElement.nativeElement);
      
      this.map.on('click', async (event) => {
        const coords = event.lngLat;
        this.updateMarker([coords.lng, coords.lat]);
        const address = await this.mapboxService.reverseGeocode(coords.lng, coords.lat);
        this.updateSelectedLocation(address, coords.lat, coords.lng);
      });

    } catch (error) {
      this.mapError = 'Failed to initialize map. Please refresh the page and try again.';
      console.error('Error initializing map:', error);
    }
  }

  private updateMarker(coords: [number, number]) {
    if (this.marker) {
      this.marker.remove();
    }

    this.marker = new mapboxgl.Marker({
      color: '#72383d',
      draggable: true
    })
      .setLngLat(coords)
      .addTo(this.map!);

    this.marker.on('dragend', async () => {
      const position = this.marker!.getLngLat();
      const address = await this.mapboxService.reverseGeocode(position.lng, position.lat);
      this.updateSelectedLocation(address, position.lat, position.lng);
    });
  }

  private updateSelectedLocation(address: string, lat: number, lng: number) {
    this.ngZone.run(() => {
      this.selectedLocation = {
        address,
        latitude: lat,
        longitude: lng
      };
      this.formData.location = this.selectedLocation;
      this.locationSearch = address;
    });
  }

  async onLocationSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    if (!query) return;

    this.searchTimeout = setTimeout(async () => {
      const result = await this.mapboxService.searchLocation(query);
      if (result) {
        const [lng, lat] = result.coordinates;
        if (this.map) {
          this.map.setCenter(result.coordinates);
          this.map.setZoom(15);
          if (result.bounds) {
            this.map.fitBounds(result.bounds, { padding: 50 });
          }
        }
        this.updateMarker([lng, lat]);
        this.updateSelectedLocation(result.address, lat, lng);
      }
    }, 500);
  }

 

  async onSubmit() {
    if (!this.formData.name || !this.selectedLocation || !this.formData.capacity || !this.formData.contact) {
      this.errorMessage = 'Please fill in all required fields and select a location';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      

      await this.campService.submitCamp({
        ...this.formData,
        location: JSON.stringify(this.formData.location),
      });

      this.successMessage = 'Camp registered successfully';
      
      // Reset form
      this.formData = {
        name: '',
        location: {
          address: '',
          latitude: 0,
          longitude: 0
        },
        contact: 0,
        capacity: 0
      };
      this.selectedFiles = [];
      this.selectedLocation = null;
      this.locationSearch = '';
      if (this.marker) {
        this.marker.remove();
      }
      
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 2000);

    } catch (error: any) {
      this.errorMessage = error.message || 'Failed to register camp. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }
}