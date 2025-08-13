import ReactGA from "react-ga4";

export const initGA = () => {
  ReactGA.initialize("G-PW2WCQ85PZ"); // your GA4 ID
};

export const logPageView = (url: string) => {
  ReactGA.send({ hitType: "pageview", page: url });
};

export const trackEvent = (name: string, params: Record<string, any> = {}) => {
  ReactGA.event(name, params);
};
