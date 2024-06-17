export interface IGymCard {
  area: string;
  gymId: number;
  name: string;
  photos: string[];
  activities: string[];
  minPrice?: number;
  medias: [];
}

export enum EOfferType {
  NONE = "NONE",
  BATCH_WITH_GUESTS = "BATCH_WITH_GUESTS",
}

export interface IBatch {
  id?: number;
  batchId: number;
  date: Date;
  duration: number;
  price: number;
  startTime: number;
  activity: string;
  activityName: string;
  trainer?: string;
  isDayPass: boolean;
  DurationMin: number;
  aboutTheActivity?: string;
  whatToBring?: string;
  whatToExpect?: string;
  moreInfo?: string;
  gymId: number;
  image?: string;

  guestsAllowed?: boolean;
  offerType?: EOfferType;
  offerPercentage?: number;
  minGuestsForOffer?: number;
}

export interface IGymDetails extends IGymCard {
  description: string;
  batches: IBatch[];
  lat: number;
  long: number;
  addressLine1: string;
  addressLine2: string;
  amenities: [];
  googleRating?: number;
  googleReviews?: number;
  operatingHours: [];
  isExclusive: boolean;
  instaLink?: string;
  isOnlyWeekend: boolean;
}
