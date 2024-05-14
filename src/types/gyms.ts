export interface IGymCard {
  area: string;
  address: string;
  gymId: number;
  name: string;
  photos: string[];
  activities: string[];
}

export interface IBatch {
  batchId: number;
  date: Date;
  duration: number;
  price: number;
  startTime: number;
  activity: string;
}

export interface IGymDetails extends IGymCard {
  description: string;
  batches: IBatch[];
  lat: number;
  long: number;
}
