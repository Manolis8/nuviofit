// src/analytics.ts
import ReactGA from 'react-ga4';

const GA_MEASUREMENT_ID = 'G-PW2WCQ85PZ'; // Replace with your GA4 ID

export const initGA = (): void => {
  ReactGA.initialize(GA_MEASUREMENT_ID);
};

export const logPageView = (path: string): void => {
  ReactGA.send({ hitType: 'pageview', page: path });
};
