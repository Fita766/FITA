// lib/auth0.js
import { initAuth0 } from '@auth0/auth0-react';

export const auth0 = initAuth0({
  domain: 'dev-7wrkbswo8ippt4gx.eu.auth0.com',  // Remplacez par votre domaine Auth0
  clientId: 'pbLlfmDMwRsuHIOnrDWNoFopcZXpsEuS',       // Remplacez par votre Client ID
  redirectUri: typeof window !== 'undefined' && window.location.origin, // Redirection vers la page actuelle après le login
});
