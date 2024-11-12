// // /pages/api/processProfiles.js
// import { fetchProfilePicture } from '../js/addSheet.js'; // Ajustez le chemin si besoin
// import path from 'path';
// import fs from 'fs';

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { url } = req.body;

//     if (!url) {
//       return res.status(400).json({ error: 'URL requise' });
//     }

//     try {
//       // Utilisez `fetchProfilePicture` pour récupérer et traiter chaque profil
//       const processedProfiles = [];
//       const profileLinks = await getProfileLinksFromPhantomBuster(url); // Appel pour obtenir des liens (exemple)

//       for (const link of profileLinks) {
//         const profileData = await fetchProfilePicture(link); // Récupération et traitement du profil
//         if (profileData) {
//           processedProfiles.push(profileData);
//         }
//       }

//       res.status(200).json(processedProfiles); // Renvoie les profils traités
//     } catch (error) {
//       console.error('Erreur lors de la récupération des profils:', error);
//       res.status(500).json({ error: 'Erreur serveur' });
//     }
//   } else {
//     res.status(405).json({ error: 'Méthode non autorisée' });
//   }
// }

