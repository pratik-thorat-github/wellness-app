// src/firebase/config.tsx
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent, setUserProperties } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDHEjMKvEU98XrPI4fk-qq5n7upyp4Ef_g",
  projectId: "zenfitx-2bc2e",
  appId: "1:1058113576240:web:00287a1f5b51a49c3dfcf5",
  measurementId: "G-1D67JM579G",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Analytics helper functions
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, any>,
) => {
  logEvent(analytics, eventName, eventParams);
};

export const setUserProfile = (userProfile: {
  user_id: string;
  phone_number: string;
  name: string;
}) => {
  setUserProperties(analytics, {
    user_id: userProfile.user_id,
    phone_number: userProfile.phone_number,
    name: userProfile.name,
    fcm_token: window.localStorage.getItem('token') // Get token from localStorage
  });
};

export { app, analytics };
