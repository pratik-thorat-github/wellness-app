import * as React from "react";
import logo from "../../logo.svg";
import { RouteComponentProps } from "@reach/router";

interface IRazorpayButton extends RouteComponentProps {}

function loadScript(src: string) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

async function displayRazorpay() {
  const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

  if (!res) {
    alert("Razorpay SDK failed to load. Are you online?");
    return;
  }

  const options = {
    key: "rzp_test_Gl4FFTP1YywZlb", // Enter the Key ID generated from the Dashboard
    amount: "5000",
    currency: "INR",
    name: "Soumya Corp.",
    description: "Test Transaction",
    image: { logo },
    order_id: "order_O2UzLiuVHZXvXL",
    callback_url: "https://88de5c65d29d3f.lhr.life/payments/rzp/webhook",
    // callback_url: "https://webhook.site/455edbd9-4437-4d8e-a0ba-4356502268e2",
    prefill: {
      name: "Soumya Dey",
      email: "SoumyaDey@example.com",
      contact: "9999999999",
    },
    notes: {
      address: "Soumya Dey Corporate Office",
    },
    theme: {
      color: "#61dafb",
    },
  };

  //@ts-ignore
  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
}

const RazorpayButton: React.FC<IRazorpayButton> = () => {
  return (
    <div>
      <button className="App-link" onClick={displayRazorpay}>
        Pay ₹500
      </button>
    </div>
  );
};

export default RazorpayButton;
