import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent } from 'firebase/analytics';

const firebaseConfig = {
    apiKey: process.env.Zenfitx_Firebase_Api_key,
    projectId: process.env.Zenfitx_Firebase_Project_Id,
    measurementId: process.env.Zenfitx_Firebase_Measurement_Id,
}

const app =  initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
    logEvent(analytics, eventName, eventParams);
}
