export interface IGymCard {
  area: string;
  gymId: number;
  name: string;
  photos: string[];
  activities: string[];
  minPrice: number;
  medias: string[];
  offerType: EOfferType;
  isExclusive: boolean;
}

export enum EOfferType {
  NONE = "NONE",
  BATCH_WITH_GUESTS = "BATCH_WITH_GUESTS",
  PLATFORM = "PLATFORM",
}

export interface IBatch {
  id?: number;
  batchId: number;
  date: Date | string;
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
  description?:string
  slots: number
  slotsBooked: number

  guestsAllowed?: boolean;
  offerType?: EOfferType;
  offerPercentage?: number;
  minGuestsForOffer?: number;
  venue?: string;
  address?: string;

  venueAddressLine1?: string;
  venueAddressLine2?: string;
  updatedAt?:string
}

export interface IGymDetails extends Omit<IGymCard, "medias"> {
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
  medias: [{ type: string; url: string }];
}
