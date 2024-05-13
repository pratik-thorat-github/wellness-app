import networkAdapter from "../network";

export async function getPlusDetailsOfUser(phone: string) {
  const result = await networkAdapter.get(`/users/plus`);
  return result.data;
}
