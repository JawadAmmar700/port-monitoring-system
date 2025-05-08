export interface Vessel {
  id: string;
  name: string;
  type: string;
  status: string;
  capacityTons: number;
  loadTons: number;
  loadType: string;
  arrivedFrom: string;
  arrivedTo: string;
  nextDestination: string;
  arrivalTime: string;
  timeLeftMinutes: number;
  color: string;
  lengthMeters: number;
  widthMeters: number;
  latitude: number;
  longitude: number;
  fuelConsumptionLitersPerHour: number;
  createdAt: string;
  updatedAt: string;
}
