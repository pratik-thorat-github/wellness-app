export interface IGymCard {
  area: string;
  gymId: number;
  name: string;
  photos: string[];
  activities: string[];
  minPrice?: number;
}

export interface IBatch {
  batchId: number;
  date: Date;
  duration: number;
  price: number;
  startTime: number;
  activity: string;
  activityName: string;
  trainer?: string;
  isDayPass: boolean;
}

export interface IGymDetails extends IGymCard {
  description: string;
  batches: IBatch[];
  lat: number;
  long: number;
  addressLine1: string;
  addressLine2: string;
}
