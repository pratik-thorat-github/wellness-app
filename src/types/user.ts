export interface IPlusDetails {
  isPlusMember: boolean;
  plusClassesRemaining: number;
  plusDiscountPercent: number;
  moneySaved: number;
  plusMemberShipPrice: number;
}

interface IUser {
  id?: number;
  name: string;
  phone: string;
  email?: string;
  gender?: "M" | "F" | "O";
  dob?: Date;
  addressLine1?: string;
  addressLine2?: string;
}

export interface IBookings {
  bookingId: string;
  bookingPrice: number;
  name: string;
  lat: number;
  long: number;
  activity: string;
  startTime: number;
  durationMin: number;
  date: Date;
}

export default IUser;
