import * as React from "react";
import { useState } from "react";

import axios from "axios";
import { Button, Flex, Segmented } from "antd";
import { GoogleCircleFilled } from "@ant-design/icons";

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
      console.log(res);
      setAccessTokenAtom(res.accessToken);
      setUserDetailsAtom(res.user);
    },
    onError: () => {
      console.log("Error in getting user from email");
      if (profileFromGoogle)
        _addUser({
          name: profileFromGoogle?.name,
          email: profileFromGoogle?.email,
        });
      setNewUser(true);
    },
  });

  const { mutate: _addUser } = useMutation({
    mutationFn: addUser,
    onSuccess: () => {
      if (profileFromGoogle) _getUserByEmail(profileFromGoogle?.email);
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
    <Flex flex={1} align="center" justify="center" vertical>
      <div>
        <h2>Welcome to One Pass</h2>
      </div>
      <div>
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
                        // dob: new Date("1998-08-26T00:00:00Z"),
                        // addressLine1: "abcd",
                        // addressLine2: "abcd",
                        // phone: "1234",
                        // gender: "M",
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
          <GoogleCircleFilled
            size={20}
            style={{ fontSize: "50px" }}
            onClick={() => {
              login();
            }}
          >
            Sign in with Google 🚀{" "}
          </GoogleCircleFilled>
        )}
        {newUser}
      </div>
    </Flex>
  );
};

export default Login;
