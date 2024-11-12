// pages/api/download-excel.js

import { writeProfileToXLS } from '../../addSheet';  // Assurez-vous que ce chemin est correct

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Appeler la fonction de génération du fichier Excel
      const profiles = await fetchProfilePicture('https://www.linkedin.com/in/some-profile');  // Utiliser un URL ou des données spécifiques
      const fileBuffer = writeProfileToXLS(profiles);

      // Définir les en-têtes pour le téléchargement du fichier
      res.setHeader('Content-Disposition', 'attachment; filename=prospection_auto.xlsx');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

      // Renvoie le fichier Excel en tant que Buffer
      res.status(200).send(fileBuffer);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la génération du fichier Excel' });
    }
  } else {
    res.status(405).json({ message: 'Méthode non autorisée' });
  }
}
