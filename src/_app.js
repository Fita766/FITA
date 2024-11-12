import { Auth0Provider } from "@auth0/auth0-react";
import { useRouter } from 'next/router';

// Remplace ces valeurs par celles que tu as récupérées de ton application Auth0
const DOMAIN = "dev-7wrkbswo8ippt4gx.eu.auth0.com";
const CLIENT_ID = "pbLlfmDMwRsuHIOnrDWNoFopcZXpsEuS";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  return (
    <Auth0Provider
      domain={DOMAIN}
      clientId={CLIENT_ID}
      authorizationParams={{ redirect_uri: window.location.origin }} // Redirection après la connexion
      cacheLocation="localstorage" // Permet de persister la session dans le stockage local
    >
      <Component {...pageProps} />
    </Auth0Provider>
  );
}

export default MyApp;
