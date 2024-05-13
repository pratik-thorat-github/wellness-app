import networkAdapter from "../network";

export async function getAllActivities() {
  const result = await networkAdapter.get("/activities/all");
  return result.data;
}

export async function getGymsByActivity(activity?: string) {
  activity = activity || "all";

  let url = `/gyms/byActivity?activity=${activity}`;
  const result = await networkAdapter.get(url);
  return result.data;
}

export async function getGymById(id: string) {
  const result = await networkAdapter.get(`/gyms/?id=${id}`);
  return result.data;
}
