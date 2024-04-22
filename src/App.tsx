import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router } from "@reach/router";

import Login from "./Pages/auth/login";
import { accessTokenAtom, userDetailsAtom } from "./atoms/atom";
import { useAtom } from "jotai/react";
import RazorpayButton from "./Pages/payment/razorpay";

// Create a client
const queryClient = new QueryClient();

function App() {
  const [accessToken] = useAtom(accessTokenAtom);
  const [userDetails] = useAtom(userDetailsAtom);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        {!(accessToken && userDetails) ? (
          <Login path="/" />
        ) : (
          <RazorpayButton path="/" />
        )}
      </Router>
    </QueryClientProvider>
  );
}

export default App;
