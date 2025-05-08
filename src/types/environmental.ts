export interface AirQuality {
  co2: number;    // ppm
  no2: number;    // ppb
  so2: number;    // ppb
  pm25: number;   // µg/m³
}

export interface WaterQuality {
  ph: number;                 // pH value
  dissolved_oxygen: number;    // mg/L
  oil_spill_detected: boolean;
}

export interface Sensor {
  id: string;
  name: string;
  type: 'air_quality' | 'water_quality' | 'noise' | 'temperature' | 'humidity';
}

export interface SensorReading {
  id: string;
  sensorId: string;
  timestamp: string;
  airQuality: {
    co2: number;        // ppm
    no2: number;        // ppb
    so2: number;        // ppb
    pm25: number;       // µg/m³
  };
  waterQuality: {
    ph: number;                 // pH value
    dissolvedOxygen: number;    // mg/L
    oilSpillDetected: boolean;
  };
  noiseLevel: number;     // dB
  temperature: number;    // °C
  humidity: number;       // %
}

export interface EnvironmentalData {
  id: string;
  timestamp: string;
  air_quality: AirQuality;
  water_quality: WaterQuality;
  noise_level: number;
  temperature: number;
  humidity: number;
}

export interface ParsedEnvironmentalData extends Omit<EnvironmentalData, 'air_quality' | 'water_quality'> {
  air_quality: string;      // JSON string from backend
  water_quality: string;    // JSON string from backend
}

export interface EnvironmentalResponse {
  data: ParsedEnvironmentalData[];
  latest: ParsedEnvironmentalData;
}

export interface EnvironmentalRecord {
    timestamp: string;
    temperature: number;
    humidity: number;
    airQuality: number;
    noiseLevel: number;
    lightIntensity: number;
    windSpeed: number;
    rainfall: number;
    pressure: number;
} 