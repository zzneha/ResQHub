import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import mapboxgl from 'mapbox-gl';

interface MapboxFeature {
  place_name: string;
  center: [number, number];
  bbox?: [number, number, number, number];
}

@Injectable({
  providedIn: 'root'
})
export class MapboxService {
  // Kerala boundaries
  private readonly KERALA_BOUNDS: [[number, number], [number, number]] = [
    [74.8520, 8.2780], // Southwest coordinates
    [77.4120, 12.8020]  // Northeast coordinates
  ];

  private readonly KERALA_CENTER: [number, number] = [76.2711, 10.8505];

  constructor() {
    mapboxgl.accessToken = environment.mapbox.accessToken;
  }

  async initializeMap(container: HTMLElement ): Promise<mapboxgl.Map> {
   // p0: { center: number[]; zoom: number; maxBounds: number[][]; }
    const map = new mapboxgl.Map({
      container,
      style: environment.mapbox.style,
      center: this.KERALA_CENTER,
      zoom: 7,
      maxBounds: this.KERALA_BOUNDS, // Restrict map panning to Kerala
      minZoom: 6.5, // Restrict zoom out to keep focus on Kerala
      maxZoom: 18
    });

    return new Promise((resolve, reject) => {
      map.on('load', () => resolve(map));
      map.on('error', (error) => reject(error));
    });
  }

  async searchLocation(query: string): Promise<LocationResult | null> {
    try {
      // Add Kerala to the search query to prioritize Kerala results
      const searchQuery = `${query}, Kerala, India`;
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?` +
        `access_token=${mapboxgl.accessToken}&` +
        `bbox=${this.KERALA_BOUNDS[0][0]},${this.KERALA_BOUNDS[0][1]},${this.KERALA_BOUNDS[1][0]},${this.KERALA_BOUNDS[1][1]}&` +
        `limit=5`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        // Filter results to ensure they're within Kerala's boundaries
        const keralaResults = data.features.filter((feature: MapboxFeature) => {
          const [lng, lat] = feature.center;
          return this.isWithinKerala(lng, lat);
        });

        if (keralaResults.length > 0) {
          const location = keralaResults[0];
          return {
            address: location.place_name,
            coordinates: location.center,
            bounds: location.bbox
          };
        }
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  }

  async reverseGeocode(lng: number, lat: number): Promise<string> {
    try {
      // Only perform reverse geocoding if within Kerala
      if (!this.isWithinKerala(lng, lat)) {
        return 'Location outside Kerala';
      }

      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?` +
        `access_token=${mapboxgl.accessToken}&` +
        `bbox=${this.KERALA_BOUNDS[0][0]},${this.KERALA_BOUNDS[0][1]},${this.KERALA_BOUNDS[1][0]},${this.KERALA_BOUNDS[1][1]}`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        return data.features[0].place_name;
      }
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  }

  isWithinKerala(lng: number, lat: number): boolean {
    return lng >= this.KERALA_BOUNDS[0][0] && 
           lng <= this.KERALA_BOUNDS[1][0] && 
           lat >= this.KERALA_BOUNDS[0][1] && 
           lat <= this.KERALA_BOUNDS[1][1];
  }
}

export interface LocationResult {
  address: string;
  coordinates: [number, number];
  bounds?: [number, number, number, number];
} 