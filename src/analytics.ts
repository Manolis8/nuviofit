import ReactGA from "react-ga4";

export const initGA = () => {
  ReactGA.initialize("G-PW2WCQ85PZ"); // your GA4 ID
};

export const logPageView = (url: string) => {
  ReactGA.send({ hitType: "pageview", page: url });
};

// Standard GA4 event
export const trackEvent = (action: string, params: Record<string, any> = {}) => {
  ReactGA.event({
    category: params.category || "Link",
    action: action,
    label: params.label || "",
    ...params,
  });
};
