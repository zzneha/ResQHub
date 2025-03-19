export interface Report {
    id: string;
    type: string;
    location: {
    address: string;
    latitude: number;
    longitude: number;
    }; // JSON string of LocationData
    description: string;
    contact: string;
    urgency: string;
    imageUrl: string;
    created_at: string;
  }
  