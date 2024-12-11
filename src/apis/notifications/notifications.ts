import { IToken } from "../../types/notification";
import networkAdapter from "../network";

export async function saveNotificationToken(body: IToken){
  const result = await networkAdapter.post(`notifications/token`, body);
  return result.data;
}
