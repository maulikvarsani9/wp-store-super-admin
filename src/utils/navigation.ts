import type { NavigateFunction } from 'react-router-dom';

let navigateFunction: NavigateFunction | null = null;

export const setNavigateFunction = (navigate: NavigateFunction) => {
  navigateFunction = navigate;
};

export const navigateToLogin = () => {
  if (navigateFunction) {
    navigateFunction('/login');
  } else {
    console.error('Navigate function not set');
    window.location.href = '/login';
  }
};

