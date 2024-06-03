import networkAdapter from "../network";

export async function getUserDeatils() {
  const result = await networkAdapter.get(`/users`);
  return result.data;
}
