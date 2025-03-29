import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy, inject } from '@angular/core';
import { CampService } from '../services/campservice';
import { MapboxService } from '../services/mapbox.service';
import * as mapboxgl from 'mapbox-gl';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, fromEvent } from 'rxjs';
import { debounceTime, takeUntil, filter } from 'rxjs/operators';

interface Shelter {
  id: string;
  name: string;
  address?: string;
  capacity?: number;
  curr_count?: number;
  latitude?: number;
  longitude?: number;
  validLat?: number;
  validLng?: number;
  distance?: number;
  location?: string;
}

interface DirectionStep {
  instruction: string;
  distance: number;
}

@Component({
  standalone: true,
  selector: 'app-find-shelter',
  imports: [FormsModule, CommonModule],
  template: `
    <div class="find-shelter-container">
      <h1>Find Nearby Shelters in Kerala</h1>
      <div class="button-group">
        <button (click)="getMyLocationAndFindShelters()" class="primary-btn" [disabled]="isLoadingLocation">
          {{ isLoadingLocation ? 'Loading...' : '🏠 Find Shelters Near Me' }}
        </button>
      </div>
      
      <div class="search-container">
        <input 
          type="text" 
          [(ngModel)]="searchQuery" 
          placeholder="Search a location..." 
        />
        <button (click)="searchLocationAndFindShelters()" class="search-btn" [disabled]="!searchQuery.trim()">
          Search
        </button>
      </div>
      
      <div class="shelters-info" *ngIf="nearbyShelters.length > 0">
        <h3>Nearby Shelters: {{ nearbyShelters.length }}</h3>
        <ul>
          <li *ngFor="let shelter of nearbyShelters">
            <div class="shelter-item">
              <div>
              <strong>{{ shelter.name || shelter.address }}</strong> - {{ shelter.distance ? shelter.distance.toFixed(2) : 'N/A' }} km
              <div *ngIf="shelter.capacity" class="occupancy-info">
                  <span [ngClass]="getOccupancyClass(shelter)">
                    Occupancy: {{ shelter.curr_count || 0 }}/{{ shelter.capacity }}
                  </span>
                </div>
              </div>
              <!-- <button (click)="getDirectionsToShelter(shelter)" class="directions-btn">Get Directions</button> -->
            </div>
          </li>
        </ul>
      </div>
      <div class="directions-panel" *ngIf="directionsInfo">
        <h3>Directions to {{ selectedShelter?.name || selectedShelter?.address }}</h3>
        <div class="directions-controls">
          <button (click)="closeDirections()" class="close-btn">Close</button>
        </div>
        <div class="directions-steps">
          <div *ngFor="let step of directionsSteps; let i = index" class="direction-step">
            <span class="step-number">{{ i + 1 }}</span>
            <span [innerHTML]="step.instruction"></span>
            <span class="distance">{{ step.distance }} m</span>
          </div>
        </div>
        <div class="directions-summary">
          <p>Total distance: {{ directionsDistance.toFixed(2) }} km</p>
          <p>Estimated time: {{ directionsTime }}</p>
        </div>
      </div>
      <div class="status-message" *ngIf="statusMessage">{{ statusMessage }}</div>
      <div #mapContainer id="map"></div>
    </div>
  `,
  styles:[`
  .find-shelter-container {
    padding: 1rem;
    text-align: center;
    background-color: #e6e6e6;
    color: #333;
  }
  
  .button-group {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  button {
    padding: 0.5rem 1rem;
    border-radius: 8px;
    border: none;
    background: #72383d;
    color: #fff;
    cursor: pointer;
    transition: background-color 0.2s ease;
    
    &:hover {
      background: #50262a;
    }
    
    &:disabled {
      background: #cccccc;
      cursor: not-allowed;
    }
  }
  
  .primary-btn {
    background: #2a5d8c;
    font-weight: bold;
    
    &:hover {
      background: #1e4267;
    }
  }
  
  .search-container {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  
  .search-btn {
    background: #2a5d8c;
    font-weight: bold;
    
    &:hover {
      background: #1e4267;
    }
  }
  
  .directions-btn {
    background: #3a7d37;
    padding: 0.3rem 0.7rem;
    font-size: 0.9rem;
    
    &:hover {
      background: #2a5d27;
    }
  }
  
  .close-btn {
    background: #d32f2f;
    padding: 0.3rem 0.7rem;
    
    &:hover {
      background: #b71c1c;
    }
  }
  
  input {
    padding: 0.5rem;
    width: 60%;
    border-radius: 8px;
    border: 1px solid #ccc;
    transition: border-color 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: #2a5d8c;
    }
  }
  
  #map {
    width: 100%;
    height: 500px;
    border-radius: 8px;
    margin-top: 1rem;
  }
  
  .shelters-info {
    margin: 1rem 0;
    padding: 1rem;
    background: #fff;
    border-radius: 8px;
    text-align: left;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    
    ul {
      max-height: 200px;
      overflow-y: auto;
      padding-left: 1rem;
    }
  }
  
  .shelter-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.8rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #eee;
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  .status-message {
    padding: 0.5rem;
    margin: 0.5rem 0;
    background: #ffe0b2;
    border-radius: 4px;
    color: #333;
  }
  
  .occupancy-info {
    font-size: 0.9rem;
    margin-top: 0.2rem;
  }
  
  .available {
    color: #388e3c;
  }
  
  .near-full {
    color: #f57c00;
  }
  
  .full {
    color: #d32f2f;
  }
  
  .directions-panel {
    margin: 1rem 0;
    padding: 1rem;
    background: #fff;
    border-radius: 8px;
    text-align: left;
    max-height: 300px;
    overflow-y: auto;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .directions-controls {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 1rem;
  }
  
  .direction-step {
    padding: 0.5rem 0;
    border-bottom: 1px solid #eee;
    display: flex;
    align-items: flex-start;
  }
  
  .step-number {
    display: inline-block;
    width: 24px;
    height: 24px;
    background: #2a5d8c;
    color: white;
    border-radius: 50%;
    text-align: center;
    line-height: 24px;
    margin-right: 0.5rem;
    flex-shrink: 0;
  }
  
  .distance {
    margin-left: auto;
    color: #666;
    padding-left: 0.5rem;
  }
  
  .directions-summary {
    margin-top: 1rem;
    padding-top: 0.5rem;
    border-top: 1px solid #ddd;
  } `]
})
export class FindShelterComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

  // Services
  private campService = inject(CampService);
  private mapboxService = inject(MapboxService);
  
  // Observables
  private destroy$ = new Subject<void>();

  // Map properties
  map!: mapboxgl.Map;
  mapInitialized = false;
  markers: mapboxgl.Marker[] = [];
  userMarker: mapboxgl.Marker | null = null;
  userLocation: [number, number] | null = null;
  directionsRoute: any = null;

  // Data properties
  shelters: Shelter[] = [];
  nearbyShelters: Shelter[] = [];
  searchQuery = '';
  
  // UI state
  isLoadingLocation = false;
  statusMessage = '';
  directionsInfo: any = null;
  directionsSteps: DirectionStep[] = [];
  directionsDistance = 0;
  directionsTime = '';
  selectedShelter: Shelter | null = null;

  // Constants
  private readonly MAX_DISTANCE_KM = 10;
  private readonly EARTH_RADIUS_KM = 6371;
  
  ngOnInit(): void {
    this.fetchShelters();
  }

  ngAfterViewInit(): void {
    this.initializeMap().catch(error => {
      console.error('Map initialization failed:', error);
      this.statusMessage = 'Failed to initialize map. Please refresh the page.';
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    
    // Clean up event listeners
    this.removePopupEventListeners();
    
    // Clean up map if initialized
    if (this.map) {
      this.map.remove();
    }
  }

  async fetchShelters(): Promise<void> {
    try {
      const shelters = await this.campService.getCamps();
      this.shelters = this.processShelterData(shelters);
      console.log('Processed shelters:', this.shelters.length);
    } catch (error) {
      console.error('Failed to fetch shelters:', error);
      this.statusMessage = 'Failed to load shelter data. Please try again later.';
    }
  }

  private processShelterData(shelters: any[]): Shelter[] {
    return shelters.map(shelter => {
      try {
        if (shelter.location && typeof shelter.location === 'string') {
          const locationData = JSON.parse(shelter.location);
          return {
            ...shelter,
            latitude: locationData.latitude,
            longitude: locationData.longitude,
            address: locationData.address,
            capacity: shelter.capacity || locationData.capacity || 100,
            currentCount: shelter.curr_count || locationData.curr_count || Math.floor(Math.random() * 100)
          };
        }
      } catch (error) {
        console.error('Error parsing location data for shelter:', shelter.id, error);
      }
      return shelter;
    });
  }

  private async initializeMap(): Promise<void> {
    this.map = await this.mapboxService.initializeMap(this.mapContainer.nativeElement);
    
    this.map.on('load', () => {
      console.log('Map loaded successfully!');
      this.mapInitialized = true;
      
      // Add routing layer
      this.map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: []
          }
        }
      });
      
      this.map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3887be',
          'line-width': 5,
          'line-opacity': 0.75
        }
      });
      
      // Setup popup event handlers
      this.setupPopupEventListeners();
    });
  }

  private setupPopupEventListeners(): void {
    // Add event listener for "Get Directions" button in popups
    document.addEventListener('getDirections', this.handlePopupDirections as EventListener);
  }
  
  private removePopupEventListeners(): void {
    document.removeEventListener('getDirections', this.handlePopupDirections as EventListener);
  }
  
  private handlePopupDirections = (e: CustomEvent) => {
    const shelterId = e.detail;
    const shelter = this.nearbyShelters.find(s => s.id === shelterId);
    if (shelter) {
      this.getDirectionsToShelter(shelter);
    }
  };

  async getMyLocationAndFindShelters(): Promise<void> {
    if (this.isLoadingLocation) return;
    
    // Clear previous results
    this.nearbyShelters = [];
    this.closeDirections();
    
    this.isLoadingLocation = true;
    this.statusMessage = 'Getting your location...';
    
    try {
      const position = await this.getCurrentPositionPromise();
      const { latitude, longitude } = position.coords;
      
      this.userLocation = [longitude, latitude];
      
      this.map.flyTo({
        center: this.userLocation,
        zoom: 12,
        essential: true
      });

      this.updateUserMarker();
      this.statusMessage = '';
      
      if (!this.mapboxService.isWithinKerala(longitude, latitude)) {
        this.statusMessage = 'Note: Your location appears to be outside Kerala.';
      }
      
      this.calculateAndDisplayNearbyShelters();
    } catch (error) {
      console.error('Geolocation error:', error);
      this.statusMessage = 'Unable to retrieve your location. Please ensure location services are enabled.';
    } finally {
      this.isLoadingLocation = false;
    }
  }
  
  private getCurrentPositionPromise(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser.'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        position => resolve(position),
        error => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  }
  
  private updateUserMarker(): void {
    if (!this.userLocation) return;
    
    if (this.userMarker) this.userMarker.remove();
    
    this.userMarker = new mapboxgl.Marker({ color: '#1e90ff' })
      .setLngLat(this.userLocation)
      .setPopup(new mapboxgl.Popup().setHTML('<h3>You are here!</h3>'))
      .addTo(this.map);
  }
  
  async searchLocationAndFindShelters(): Promise<void> {
    if (!this.searchQuery.trim()) return;
    
    this.nearbyShelters = [];
    this.closeDirections();
    this.statusMessage = 'Searching location...';

    try {
      const result = await this.mapboxService.searchLocation(this.searchQuery);

      if (result) {
        this.userLocation = [result.coordinates[0], result.coordinates[1]];
        
        this.map.flyTo({
          center: result.coordinates,
          zoom: 12,
          essential: true
        });

        this.updateUserMarker();
        this.statusMessage = '';
        
        if (!this.mapboxService.isWithinKerala(result.coordinates[0], result.coordinates[1])) {
          this.statusMessage = 'Note: This location may be outside Kerala.';
        }
        
        this.calculateAndDisplayNearbyShelters();
      } else {
        this.statusMessage = 'Location not found. Please try a different search term.';
      }
    } catch (error) {
      console.error('Search failed:', error);
      this.statusMessage = 'Search failed. Please try again.';
    }
  }
  
  private calculateAndDisplayNearbyShelters(): void {
    this.statusMessage = 'Finding nearby shelters...';
    
    if (!this.userLocation) {
      this.statusMessage = 'Your location is not available. Please try again.';
      return;
    }
    
    if (!this.shelters || this.shelters.length === 0) {
      this.statusMessage = 'No shelter data available. Please try again later.';
      return;
    }
    
    console.log(`Calculating distances from [${this.userLocation[0]}, ${this.userLocation[1]}]`);
    
    this.nearbyShelters = [];
    
    const sheltersWithDistance = this.getSheltersWithDistance();
    
    if (sheltersWithDistance.length === 0) {
      this.statusMessage = `No shelters found within ${this.MAX_DISTANCE_KM} km of your location.`;
      this.clearMarkers();
      this.updateUserMarker();
      return;
    }
    
    // Sort by distance
    this.nearbyShelters = sheltersWithDistance.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
    
    this.updateShelterPopups();
    this.updateUserMarker();
    this.fitMapToClosestShelters();
    
    this.statusMessage = `Found ${sheltersWithDistance.length} shelters within ${this.MAX_DISTANCE_KM} km of your location.`;
  }
  
  private getSheltersWithDistance(): Shelter[] {
    const sheltersWithDistance: Shelter[] = [];
    let processedCount = 0;
    let invalidCount = 0;
    
    for (const shelter of this.shelters) {
      processedCount++;
      
      const lat = this.getCoordinate(shelter, ['latitude', 'lat', 'Latitude', 'LAT', 'LATITUDE']);
      const lng = this.getCoordinate(shelter, ['longitude', 'lng', 'long', 'Longitude', 'LONGITUDE', 'LON', 'LONG']);
      
      if (lat === null || lng === null) {
        invalidCount++;
        continue;
      }
      
      const distance = this.calculateDistance(
        this.userLocation![1], this.userLocation![0],
        lat, lng
      );
      
      if (distance <= this.MAX_DISTANCE_KM) {
        sheltersWithDistance.push({
          ...shelter,
          distance,
          validLat: lat,
          validLng: lng,
          name: shelter.name || shelter.address || `Shelter ${sheltersWithDistance.length + 1}`
        });
      }
    }
    
    console.log(`Processed: ${processedCount}, Invalid: ${invalidCount}, Valid within ${this.MAX_DISTANCE_KM}km: ${sheltersWithDistance.length}`);
    
    return sheltersWithDistance;
  }
  
  private getCoordinate(obj: any, possibleNames: string[]): number | null {
    for (const name of possibleNames) {
      if (name in obj && obj[name] !== null && obj[name] !== undefined) {
        const value = parseFloat(obj[name]);
        if (!isNaN(value)) return value;
      }
    }
    return null;
  }
  
  private updateShelterPopups(): void {
    this.clearMarkers();
    
    if (this.userLocation) {
      this.updateUserMarker();
    }
    
    this.nearbyShelters.forEach((shelter) => {
      const lat = shelter.validLat;
      const lng = shelter.validLng;
      
      if (!lat || !lng) return;
      
      const color = this.getOccupancyColor(shelter);
      
      const popupHtml = this.createPopupHtml(shelter);
      
      try {
        const marker = new mapboxgl.Marker({ color }) 
          .setLngLat([lng, lat])
          .setPopup(new mapboxgl.Popup().setHTML(popupHtml))
          .addTo(this.map);
          
        this.markers.push(marker);
      } catch (error) {
        console.error('Error adding marker for shelter:', error, shelter);
      }
    });
  }
  
  getOccupancyClass(shelter: Shelter): string {
    if (!shelter.capacity) return 'available';
    
    const occupancyPercentage = (shelter.curr_count || 0) / shelter.capacity * 100;
    
    if (occupancyPercentage >= 100) return 'full';
    if (occupancyPercentage >= 80) return 'near-full';
    return 'available';
  }
  
  private getOccupancyColor(shelter: Shelter): string {
    if (!shelter.capacity) return '#00CC00';
    
    const occupancyPercentage = (shelter.curr_count || 0) / shelter.capacity * 100;
    
    if (occupancyPercentage >= 100) return '#d32f2f';
    if (occupancyPercentage >= 80) return '#FF8C00';
    return '#00CC00';
  }
  
  private getOccupancyStatus(shelter: Shelter): { status: string, color: string } {
    if (!shelter.capacity) return { status: 'Available', color: '#388e3c' };
    
    const occupancyPercentage = (shelter.curr_count || 0) / shelter.capacity * 100;
    
    if (occupancyPercentage >= 100) return { status: 'Full', color: '#d32f2f' };
    if (occupancyPercentage >= 80) return { status: 'Near Full', color: '#f57c00' };
    return { status: 'Available', color: '#388e3c' };
  }
  
  private createPopupHtml(shelter: Shelter): string {
    const occupancy = this.getOccupancyStatus(shelter);
    
    let html = `<h3>${shelter.name || shelter.address || 'Shelter'}</h3>`;
    html += `<p>Distance: ${shelter.distance?.toFixed(2)} km</p>`;
    
    if (shelter.address) {
      html += `<p>Address: ${shelter.address}</p>`;
    }
    
    html += `<p>Occupancy: <span style="color:${occupancy.color}">
              ${shelter.curr_count || 0}/${shelter.capacity || 'N/A'} (${occupancy.status})
            </span></p>`;
            
    html += `<button class="directions-popup-btn" 
              style="background-color:#3a7d37;color:white;border:none;padding:5px 10px;border-radius:4px;cursor:pointer;" 
              onclick="document.dispatchEvent(new CustomEvent('getDirections', {detail: '${shelter.id}'}))">
              Get Directions
            </button>`;
    
    return html;
  }
  
  private fitMapToClosestShelters(): void {
    if (this.nearbyShelters.length === 0 || !this.userLocation) return;
    
    try {
      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend(this.userLocation);
      
      const sheltersToShow = this.nearbyShelters.slice(0, 5);
      sheltersToShow.forEach(shelter => {
        if (shelter.validLat && shelter.validLng) {
          bounds.extend([shelter.validLng, shelter.validLat]);
        }
      });
      
      this.map.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      });
    } catch (error) {
      console.error('Error fitting map to markers:', error);
    }
  }
  
  async getDirectionsToShelter(shelter: Shelter): Promise<void> {
    if (!this.map || !this.mapInitialized) {
      this.statusMessage = 'Map is not yet initialized. Please try again in a moment.';
      return;
    }
    
    if (!this.userLocation) {
      this.statusMessage = 'Your location is not available. Please try again.';
      return;
    }
    
    if (!shelter.validLat || !shelter.validLng) {
      this.statusMessage = 'Invalid shelter location data.';
      return;
    }
    
    this.statusMessage = 'Getting directions...';
    this.selectedShelter = shelter;
    
    try {
      // Make sure we're providing coordinates in the correct format - [longitude, latitude]
      const directions = await this.mapboxService.getDirections(
        this.userLocation,  // [longitude, latitude]
        [shelter.validLng, shelter.validLat]  // [longitude, latitude]
      );
      
      if (!directions || !directions.routes || directions.routes.length === 0) {
        this.statusMessage = 'No route found to this shelter.';
        return;
      }
      
      this.processAndDisplayDirections(directions);
      
    } catch (error) {
      console.error('Error getting directions:', error);
      this.statusMessage = 'Failed to get directions. Please try again.';
    }
  }
  
  private processAndDisplayDirections(directions: any): void {
    const route = directions.routes[0];
    this.directionsDistance = route.distance / 1000;
    
    // Format duration
    const durationMinutes = Math.floor(route.duration / 60);
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    this.directionsTime = hours > 0 ? 
      `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minute${minutes > 1 ? 's' : ''}` : 
      `${minutes} minute${minutes > 1 ? 's' : ''}`;
    
    // Extract steps for display
    this.directionsSteps = route.legs[0].steps.map((step: any) => ({
      instruction: step.maneuver.instruction,
      distance: Math.round(step.distance)
    }));
    
    // Update the route on the map - CHECK IF SOURCE EXISTS FIRST
    const routeSource = this.map.getSource('route');
    if (routeSource) {
      (routeSource as mapboxgl.GeoJSONSource).setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route.geometry.coordinates
        }
      });
    } else {
      // If the source doesn't exist, create it
      this.createRouteSourceAndLayer(route.geometry.coordinates);
    }
    
    // Show directions panel
    this.directionsInfo = route;
    
    // Clear status message
    this.statusMessage = '';
    
    // Fit map to show the entire route
    const bounds = new mapboxgl.LngLatBounds();
    route.geometry.coordinates.forEach((coord: [number, number]) => {
      bounds.extend(coord);
    });
    
    this.map.fitBounds(bounds, {
      padding: 50
    });
  }
  
  // Add a new method to create the route source and layer if they don't exist
  private createRouteSourceAndLayer(coordinates: any[]): void {
    if (!this.map.getSource('route')) {
      this.map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: coordinates
          }
        }
      });
      
      this.map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3887be',
          'line-width': 5,
          'line-opacity': 0.75
        }
      });
    }
  }
  
  closeDirections(): void {
    this.directionsInfo = null;
    this.directionsSteps = [];
    this.selectedShelter = null;
    
    // Clear the route from the map
    const routeSource = this.map.getSource('route');
    if (routeSource) {
      (routeSource as mapboxgl.GeoJSONSource).setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: []
        }
      });
    }
  }
  
  private clearMarkers(): void {
    this.markers.forEach(marker => marker.remove());
    this.markers = [];
  }
  
  // Haversine formula to calculate distance
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return this.EARTH_RADIUS_KM * c;
  }
  
  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }
}