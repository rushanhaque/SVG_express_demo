import React from 'react';
import { createRoot } from 'react-dom/client';
import 'lenis/dist/lenis.css';
import './styles/base.css';
import App from './App.jsx';
import { prefersReducedMotion, detectLite } from './lib/motion';

if (prefersReducedMotion()) document.documentElement.classList.add('rm');
if (detectLite()) document.documentElement.classList.add('lite');

createRoot(document.getElementById('root')).render(<App />);
