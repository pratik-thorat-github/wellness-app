import * as React from "react";
import { useState } from "react";

import axios from "axios";

import { RouteComponentProps } from "@reach/router";
import {
  CredentialResponse,
  GoogleLogin,
  useGoogleLogin,
} from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";
import {
  addUser,
  getDetailsFromGoogleProfile,
  getUserByEmail,
} from "../../apis/auth/login";
import { accessTokenAtom, userDetailsAtom } from "../../atoms/atom";
import { useAtom } from "jotai/react";

interface ILoginProps extends RouteComponentProps {}

interface IProfileInterface {
  picture: string;
  name: string;
  email: string;
}

const Login: React.FC<ILoginProps> = ({}) => {
  const responseMessage = (response: CredentialResponse) => {
    console.log(response);
  };
  const errorMessage = () => {
    console.log("Something went wrong in google login");
  };

  const [userGoogleLogin, setUserGoogleLogin] = useState<{
    access_token: string;
  } | null>(null);
  const [profileFromGoogle, setProfileFromGoogle] =
    useState<IProfileInterface | null>(null);
  const [newUser, setNewUser] = useState(false);

  const [_accessTokenAtom, setAccessTokenAtom] = useAtom(accessTokenAtom);
  const [_userDetailsAtom, setUserDetailsAtom] = useAtom(userDetailsAtom);

  const { mutate: _getDetailsFromGoogleProfile } = useMutation({
    mutationFn: getDetailsFromGoogleProfile,
    onMutate: () => {},
    onSuccess: (res: any) => {
      setProfileFromGoogle(res);
      _getUserByEmail(res.email);
    },
    onError: () => {
      console.log("Error in getting user details from google");
    },
  });

  const { mutate: _getUserByEmail } = useMutation({
    mutationFn: getUserByEmail,
    onMutate: () => {},
    onSuccess: (res: any) => {
      setAccessTokenAtom(res.accessToken);
      setUserDetailsAtom(res.user);
    },
    onError: () => {
      console.log("Error in getting user from email");
      setNewUser(true);
    },
  });

  const { mutate: _addUser } = useMutation({
    mutationFn: addUser,
    onSuccess: (data: any) => {
      setAccessTokenAtom(data.accessToken);
      setUserDetailsAtom(data.user);
      console.log(data);
      console.log(_accessTokenAtom);
      console.log(_userDetailsAtom);
    },
    onError: (error: Error) => {
      console.log(error);
    },
  });

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      if (codeResponse.scope)
        setUserGoogleLogin({ access_token: codeResponse.access_token });
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  React.useEffect(() => {
    if (userGoogleLogin) {
      _getDetailsFromGoogleProfile(userGoogleLogin.access_token);
    }
  }, [userGoogleLogin]);

  return (
    <div>
      <h2>React Google Login</h2>
      <br />
      <br />
      {profileFromGoogle ? (
        <div>
          <img src={profileFromGoogle.picture} alt="user image" />
          <h3>User Logged in</h3>
          <p>Name: {profileFromGoogle.name}</p>
          <p>Email Address: {profileFromGoogle.email}</p>
          <br />
          <br />

          {newUser ? (
            <div>
              <input type="text" title="Phone" />
              <select>
                <option>M</option>
                <option>F</option>
                <option>O</option>
              </select>
              <input type="date" title="DOB" />
              <input type="text" title="AddressLine1" />
              <input type="text" title="AddressLine2" />
              <br />
              <br />

              <button
                onClick={() => {
                  {
                    _addUser({
                      name: "Tejas",
                      email: profileFromGoogle.email,
                      dob: new Date("1998-08-26T00:00:00Z"),
                      addressLine1: "abcd",
                      addressLine2: "abcd",
                      phone: "1234",
                      gender: "M",
                    });
                  }
                }}
              >
                submit
              </button>
            </div>
          ) : null}
        </div>
      ) : (
        <button
          onClick={() => {
            login();
          }}
        >
          Sign in with Google 🚀{" "}
        </button>
      )}
      {newUser}
    </div>
  );
};

export default Login;
