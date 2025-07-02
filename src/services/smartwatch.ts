import { SmartWatchData, StepsData, HeartRateData, SleepData, CalorieData } from "@/interfaces/SmartWatchData";

// Mock data for smartwatch service
// In a real implementation, this would interact with actual smartwatch APIs

let mockConnectedWatch: SmartWatchData | null = null;

// Sample historical data
const mockHistoricalSteps: StepsData[] = [
  { day: "Mon", count: 6542 },
  { day: "Tue", count: 7893 },
  { day: "Wed", count: 5246 },
  { day: "Thu", count: 8921 },
  { day: "Fri", count: 7432 },
  { day: "Sat", count: 9872 },
  { day: "Sun", count: 4521 }
];

const mockHeartRateData: HeartRateData[] = [
  { time: "6:00", value: 62 },
  { time: "9:00", value: 78 },
  { time: "12:00", value: 82 },
  { time: "15:00", value: 75 },
  { time: "18:00", value: 88 },
  { time: "21:00", value: 72 },
  { time: "0:00", value: 65 }
];

const mockSleepData: SleepData[] = [
  { date: "May 1", hours: 7.5, quality: "good" },
  { date: "May 2", hours: 6.2, quality: "fair" },
  { date: "May 3", hours: 8.1, quality: "excellent" },
  { date: "May 4", hours: 5.8, quality: "poor" },
  { date: "May 5", hours: 7.2, quality: "good" },
  { date: "May 6", hours: 6.9, quality: "fair" },
  { date: "May 7", hours: 7.8, quality: "good" }
];

const mockCalorieData: CalorieData[] = [
  { day: "Mon", burned: 1850 },
  { day: "Tue", burned: 2150 },
  { day: "Wed", burned: 1920 },
  { day: "Thu", burned: 2380 },
  { day: "Fri", burned: 2050 },
  { day: "Sat", burned: 1750 },
  { day: "Sun", burned: 1450 }
];

export const connectSmartWatch = (deviceType: 'apple' | 'fitbit' | 'garmin' | 'samsung'): Promise<SmartWatchData> => {
  return new Promise((resolve) => {
    // Simulate connection delay
    setTimeout(() => {
      mockConnectedWatch = {
        steps: Math.floor(Math.random() * 5000) + 5000,
        heartRate: Math.floor(Math.random() * 30) + 60,
        sleepHours: Math.floor(Math.random() * 3) + 6,
        caloriesBurned: Math.floor(Math.random() * 1000) + 1000,
        lastSynced: new Date(),
        deviceType,
        isConnected: true
      };
      
      resolve(mockConnectedWatch);
    }, 2000);
  });
};

export const disconnectSmartWatch = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Simulate disconnection delay
    setTimeout(() => {
      mockConnectedWatch = null;
      resolve(true);
    }, 1000);
  });
};

export const getSmartWatchStatus = (): Promise<SmartWatchData | null> => {
  return new Promise((resolve) => {
    // If no watch is connected, return null
    if (!mockConnectedWatch) {
      resolve(null);
      return;
    }
    
    // Otherwise, update the data with some slight variations to simulate real-time changes
    mockConnectedWatch = {
      ...mockConnectedWatch,
      steps: mockConnectedWatch.steps + Math.floor(Math.random() * 100),
      heartRate: Math.max(60, Math.min(100, mockConnectedWatch.heartRate + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 5))),
      caloriesBurned: mockConnectedWatch.caloriesBurned + Math.floor(Math.random() * 20),
      lastSynced: new Date()
    };
    
    resolve(mockConnectedWatch);
  });
};

export const getStepsData = (): Promise<StepsData[]> => {
  return Promise.resolve(mockHistoricalSteps);
};

export const getHeartRateData = (): Promise<HeartRateData[]> => {
  return Promise.resolve(mockHeartRateData);
};

export const getSleepData = (): Promise<SleepData[]> => {
  return Promise.resolve(mockSleepData);
};

export const getCalorieData = (): Promise<CalorieData[]> => {
  return Promise.resolve(mockCalorieData);
};

export const syncWatchData = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Simulate sync delay
    setTimeout(() => {
      if (mockConnectedWatch) {
        mockConnectedWatch.lastSynced = new Date();
      }
      resolve(!!mockConnectedWatch);
    }, 1500);
  });
};
