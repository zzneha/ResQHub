export interface Alert {
  id: string;
  type: 'hurricane' | 'earthquake' | 'flood' | 'fire' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  description: string;
  timestamp: Date;
}