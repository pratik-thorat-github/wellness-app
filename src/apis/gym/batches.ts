import networkAdapter from "../network";

export async function getGymBatchesForDate({
  id,
  date,
  activity,
}: {
  id: number;
  date: string;
  activity: string;
}) {
  const result = await networkAdapter.get(
    `/gyms/batch/?gymId=${id}&date=${date}&activity=${activity}`
  );
  return result.data;
}
