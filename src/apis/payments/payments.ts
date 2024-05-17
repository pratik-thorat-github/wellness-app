import networkAdapter from "../network";

export interface ICreateRzpOrder {
  userId: number;
  batchId: number;
  totalAmount: number;
  batchPrice: number;
  plusMembershipOpted: boolean;
  plusMembershipPrice: number;
  plusMembershipDiscount: number;
}

export async function createRzpOrder(data: ICreateRzpOrder) {
  const result = await networkAdapter.post("/payments/rzp/order", data);

  return result.data;
}

export async function createCfOrder(data: ICreateRzpOrder) {
  const result = await networkAdapter.post("/payments/cf/order", data);

  return result.data;
}
