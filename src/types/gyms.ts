export interface IGymCard {
  area: string;
  addressLine1: string;
  addressLine2: string;
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
}

export interface IGymDetails extends IGymCard {
  description: string;
  batches: IBatch[];
  lat: number;
  long: number;
}
