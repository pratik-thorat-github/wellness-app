import axios from "axios";
import { BE_URL } from "../../constants/network";
import IUser from "../../types/user";

export async function getUserByEmail(email: string) {
  // let response = await axios.get(`${BE_URL}/users?email=${email}`);

  // return response.data;

  throw new Error("Testing user not found");
}

export async function getDetailsFromGoogleProfile(accessToken: string) {
  let response = await axios.get(
    `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    }
  );

  return response.data;
}

export async function addUser(userDetails: IUser) {
  let payload = {
    Name: userDetails.name,
    Dob: userDetails.dob,
    Email: userDetails.email,
    Phone: userDetails.phone,
    Gender: userDetails.gender,
    addressLine1: userDetails.addressLine1,
    addressLine2: userDetails.addressLine2,
  };
  // let response = await axios.post(`${BE_URL}/users`, payload);
  // return response.data;

  return {
    accessToken: "abcd",
    user: userDetails,
  };
}
