// 'use client';

// import { useEffect, useState } from "react";
// import { Auth0Provider } from "@auth0/auth0-react";

// // Remplace ces valeurs par celles que tu as récupérées de ton application Auth0
// const DOMAIN = "dev-7wrkbswo8ippt4gx.eu.auth0.com";
// const CLIENT_ID = "pbLlfmDMwRsuHIOnrDWNoFopcZXpsEuS";

// const Auth0ProviderWrapper = ({ children }) => {
//   const [isClient, setIsClient] = useState(false);

//   // Utiliser useEffect pour s'assurer que le code s'exécute seulement côté client
//   useEffect(() => {
//     setIsClient(true); // Définit isClient à true après le premier rendu côté client
//   }, []);

//   if (!isClient) {
//     return null; // Retourne null pendant le rendu côté serveur
//   }

//   return (
//     <Auth0Provider
//       domain={DOMAIN}
//       clientId={CLIENT_ID}
//       authorizationParams={{ redirect_uri: window.location.origin }} // Utilisation de window uniquement côté client
//     >
//       {children}
//     </Auth0Provider>
//   );
// };

// export default Auth0ProviderWrapper;
