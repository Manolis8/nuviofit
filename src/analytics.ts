import ReactGA from "react-ga4";

export const initGA = () => {
  ReactGA.initialize("G-SE69QYZ1J5"); // Replace with your GA4 ID
};

export const logPageView = (url: string) => {
  ReactGA.send({ hitType: "pageview", page: url });
};

