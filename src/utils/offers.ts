import { EOfferType, IGymCard, IGymDetails } from "../types/gyms";
import IUser from "../types/user";

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
  userDetails: IUser | null
) {
  let showDiscount = false;
  if(gym.gymId == 6 || gym.gymId == 21 || gym.gymId == 22 || gym.gymId == 24) showDiscount = false;
  else if (gym.offerType == EOfferType.BATCH_WITH_GUESTS) showDiscount = false;
  else if (!userDetails) showDiscount = true;
  else if (userDetails && userDetails.noOfBookings < 1) showDiscount = true;

  return showDiscount;
}
