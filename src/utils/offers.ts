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

