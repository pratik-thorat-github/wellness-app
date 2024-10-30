// global.d.ts
interface Window {
    ReactNativeWebView: {
      postMessage: (message: string) => void;
    };
    onAppLoad?: () => void; 
    isFromApp?: boolean;
    platformInfo: {
        platform: string,
        version: string
    }
  }

//   declare global {
//     interface Window {
//       ReactNativeWebView: {
//         postMessage: (message: string) => void;
//       };
//       onAppLoad?: () => void; 
//       isFromApp?: boolean;
//     }
//   }