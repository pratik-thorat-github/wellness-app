import { EOfferType, IGymCard, IGymDetails } from "../types/gyms";
import IUser from "../types/user";

interface PastAppBookingObject {
  [key: string]: any; // Or use a more specific type
}

export function deductPercentage(
  basePrice: number,
  discountPercentage: number
) {
  let finalAmount = basePrice * (1 - discountPercentage / 100);
  finalAmount = Math.floor(finalAmount);

  let discount = basePrice - finalAmount;

  return [finalAmount, discount];
}

export const discountTxt = "50% off on your first booking on ZenfitX";


export function showDiscountText(
  gym: IGymCard | IGymDetails,
  userDetails: IUser | null,
  isFromApp: boolean,
  pastAppBookings: PastAppBookingObject
) {
  let showDiscount = false;
  let pastAppBookingExists = pastAppBookings[`${gym.gymId}`];
  if(!userDetails) showDiscount = true;
  else if(!isFromApp) showDiscount = false;
  else if(gym.offerType == EOfferType.BATCH_WITH_GUESTS) showDiscount = false;
  else if(pastAppBookingExists) showDiscount = false;
  else showDiscount = true;

  console.log({showDiscount});
  return showDiscount;
}
