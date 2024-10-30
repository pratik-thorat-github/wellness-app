import { EOfferType } from "../../types/gyms";
import networkAdapter from "../network";

export interface ICreateRzpOrder {
  userId: number;
  batchId: number;
  totalAmount: number;
  batchPrice: number;
  plusMembershipOpted?: boolean;
  plusMembershipPrice?: number;
  plusMembershipDiscount?: number;
  offerPercentage: number;
  offerType: EOfferType;
  noOfGuests: number;
  batchName: string;
  batchTime: number;
  batchDate: Date | string;
  username: string;
}

export async function createRzpOrder(data: ICreateRzpOrder) {
  const result = await networkAdapter.post("/payments/rzp/order", data);
  console.log({resultData: result.data});
  return result.data;
}

export async function createCfOrder(data: ICreateRzpOrder) {
  const result = await networkAdapter.post("/payments/cf/order", data);

  return result.data;
}
