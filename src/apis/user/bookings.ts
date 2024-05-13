import networkAdapter from "../network";

export async function getBookingOfUser() {
  const result = await networkAdapter.get(`/bookings/`);
  return result.data;
}
