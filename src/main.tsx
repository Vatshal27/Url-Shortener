import './index.css';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import ReactGA from 'react-ga4';

// Initialize Google Analytics (replace with your actual Measurement ID)
ReactGA.initialize('G-XXXXXXXXXX');

// Track initial page load
ReactGA.send({
  hitType: 'pageview',
  page: window.location.pathname + window.location.search,
});

// Render app
createRoot(document.getElementById('root')!).render(<App />);
