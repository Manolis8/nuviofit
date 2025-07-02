
export interface SmartWatchData {
  steps: number;
  heartRate: number;
  sleepHours: number;
  caloriesBurned: number;
  lastSynced: Date;
  deviceType: 'apple' | 'fitbit' | 'garmin' | 'samsung' | 'unknown';
  isConnected: boolean;
}

export interface StepsData {
  day: string;
  count: number;
}

export interface HeartRateData {
  time: string;
  value: number;
}

export interface SleepData {
  date: string;
  hours: number;
  quality: 'poor' | 'fair' | 'good' | 'excellent';
}

export interface CalorieData {
  day: string;
  burned: number;
}

// Add daily activity interface for device page
export interface DailyActivity {
  date: string;
  steps: number;
  caloriesBurned: number;
  activeMinutes: number;
  distance: number;
}

// Add sleep metrics interface for detailed sleep analysis
export interface SleepMetrics {
  date: string;
  totalHours: number;
  deepSleep: number;
  lightSleep: number;
  remSleep: number;
  awake: number;
  quality: 'poor' | 'fair' | 'good' | 'excellent';
}

// Added device brand types for better type safety
export type SmartWatchBrand = 'apple' | 'fitbit' | 'garmin' | 'samsung' | 'unknown';

// Added interface for device support information
export interface DeviceSupport {
  brand: SmartWatchBrand;
  name: string;
  logo: string;
  supported: boolean;
  features: string[];
}
