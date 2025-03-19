import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CampService } from '../services/campservice';
import { MapboxService } from '../services/mapbox.service';
import * as mapboxgl from 'mapbox-gl';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
  selector: 'app-find-shelter',
  imports :[FormsModule,CommonModule],
  template: `
    <div class="find-shelter-container">
      <h1>Find Nearby Shelters in Kerala</h1>
      <button (click)="getMyLocation()">📍 Find My Location</button>
      <input type="text" [(ngModel)]="searchQuery" placeholder="Search a location..." (keyup.enter)="searchLocation()" />
      <div #mapContainer id="map"></div>
    </div>
  `,
  styles: [`
    .find-shelter-container { padding: 1rem; text-align: center; background-color: #e6e6e6; color: #333; }
    button { margin-bottom: 1rem; padding: 0.5rem 1rem; border-radius: 8px; border: none; background: #72383d; color: #fff; cursor: pointer; }
    button:hover { background: #50262a; }
    input { padding: 0.5rem; width: 60%; margin-bottom: 1rem; border-radius: 8px; border: 1px solid #ccc; }
    #map { width: 100%; height: 500px; border-radius: 8px; margin-top: 1rem; }
  `]
})
export class FindShelterComponent implements OnInit, AfterViewInit {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

  map!: mapboxgl.Map;
  shelters: any[] = [];
  searchQuery: string = '';
  userMarker!: mapboxgl.Marker | null;

  constructor(
    private campService: CampService,
    private mapboxService: MapboxService
  ) {}

  async ngOnInit() {
    try {
      this.shelters = await this.campService.getCamps();
    } catch (error) {
      console.error('Failed to fetch shelters:', error);
    }
  }

  async ngAfterViewInit() {
    try {
      this.map = await this.mapboxService.initializeMap(this.mapContainer.nativeElement);
  
      // Ensure map load event fires
      this.map.on('load', () => {
        console.log('Map loaded successfully!');
        this.addShelterMarkers();  // ✅ Add markers after map load
      });
    } catch (error) {
      console.error('Map initialization failed:', error);
    }
  }
  

  addShelterMarkers() {
    console.log('Adding markers...');
  
    if (!this.shelters || this.shelters.length === 0) {
      console.warn('No shelter data available');
      return;
    }
  
    this.shelters.forEach((shelter) => {
      const { latitude, longitude, name } = shelter;
  
      // Ensure coordinates are numeric
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
  
      if (isNaN(lat) || isNaN(lng)) {
        console.error('Invalid shelter coordinates:', shelter);
        return;
      }
  
      // Ensure the map is fully loaded
      if (this.map.loaded() && this.mapboxService.isWithinKerala(lng, lat)) {
        console.log(`Adding marker for ${name} at ${lng}, ${lat}`);
  
        new mapboxgl.Marker({ color: '#72383d' })
          .setLngLat([lng, lat])
          .setPopup(new mapboxgl.Popup().setHTML(`<h3>${name}</h3>`))
          .addTo(this.map);
      } else {
        console.warn(`Skipping marker for ${name}: out of bounds or map not loaded.`);
      }
    });
  }
  
  async searchLocation() {
    if (!this.searchQuery.trim()) return;

    const result = await this.mapboxService.searchLocation(this.searchQuery);

    if (result && this.mapboxService.isWithinKerala(result.coordinates[0], result.coordinates[1])) {
      this.map.flyTo({
        center: result.coordinates,
        zoom: 10,
        essential: true
      });
    } else {
      alert('Location not found or outside Kerala!');
    }
  }

  getMyLocation() {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Ensure location is within Kerala boundaries
        if (this.mapboxService.isWithinKerala(longitude, latitude)) {
          this.map.flyTo({
            center: [longitude, latitude],
            zoom: 12,
            essential: true
          });

          // Add a blue marker for the user's location
          if (this.userMarker) this.userMarker.remove(); // Remove previous marker
          this.userMarker = new mapboxgl.Marker({ color: '#1e90ff' })
            .setLngLat([longitude, latitude])
            .setPopup(new mapboxgl.Popup().setHTML('<h3>You are here!</h3>'))
            .addTo(this.map);
        } else {
          alert('Your location is outside Kerala!');
        }
      },
      () => {
        alert('Unable to retrieve your location.');
      }
    );
  }
}
