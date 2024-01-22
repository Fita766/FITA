import creds from '@/json/credentials.json';
import axios from 'axios';
import fs from 'fs/promises';
import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';

const linkDefault = 'https://www.linkedin.com/in/thomas-millet-28609434/';
/* 
const apiKey = process.env.APIKEY
const apiKeyGS = process.env.APIKEYGS
*/


// Récupère les données de l'agent Phantombuster depuis le fichier d'environnement
require('dotenv').config();
const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY,
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets',
  ],
});

// List des headers pour le Google Sheet
const headers = ['Timestamp', 'FirstName', 'LastName', 'CompanyName', 'LinkedInURL'];


//ENVOIE DE LIEN A PROXYCURL

export async function fetchProfilePicture (link) {
    try {
        const response = await axios.get('https://nubela.co/proxycurl/api/v2/linkedin', {
            params: {
                'linkedin_profile_url': link,
            },
            headers: {
                'Authorization': 'Bearer u91wm9QhDGTb9QKg29FjiA	',
            },
        });

        profileData = response.data;
        // Sauvegarde des données dans un fichier JSON
        await fs.writeFile('profileData.json', JSON.stringify(profileData, null, 2));
        // Mis à jour du Google Sheet
        await updateGoogleSheet(link, profileData);
    } catch (error) {
        console.error(error);
    }
}


// ENVOIE DE DONNEE A GOOGLE SHEET
async function updateGoogleSheet(link, profileDataLK) {
    const doc = new GoogleSpreadsheet('1wApnLeSHib2ni74gVpN-zhRrH02lUWt6V-c_J3Gx-rE', serviceAccountAuth);
    try {
        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[ 0 ];
        // Ajout des headers
        sheet.setHeaderRow(headers);

        // Ajout des données
        await sheet.addRow({
            Timestamp: new Date(),
            FirstName: profileDataLK.first_name,
            LastName: profileDataLK.last_name,
            CompanyName: profileDataLK.experiences[0]?.company || 'Aucune entreprise',
            LinkedInURL: link,
        });

        console.log('Données ajoutées à Google Sheet avec succès.');
    } catch (error) {
        console.error('Erreur lors de la mise à jour de Google Sheet:', error);
    }
}

// // ENVOIE DE LIEN A GOOGLE SHEET
export async function updateSearchLink (link) { 
    const doc = new GoogleSpreadsheet('1Ypkfu2mehLVKP1M5F3sDKQmuwOWC3elYNwKdrVu0Y-c', serviceAccountAuth);
    try {
        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[ 0 ];
        await sheet.clear();
        // Remplacement du lien
        await sheet.loadCells('A1:E10');
        const a1 = sheet.getCell(0, 0);

        a1.value = link || linkDefault;
        // Mis à jour du Google Sheet
        await sheet.saveUpdatedCells();
        console.log('Données ajoutées à Google Sheet avec succès.');
    } catch (error) {
        console.error('Erreur lors de la mise à jour de Google Sheet:', error);
    }

}

// ENVOIE DES DONNES A LGM

// async function createLead() {
//     await new Promise(resolve => setTimeout(resolve, 60000));

//     leadData.firstname = profileData.first_name;
//     leadData.lastname = profileData.last_name;
//     const firstExperience = profileData.experiences && profileData.experiences.length > 0 ? profileData.experiences[0] : null;
//     leadData.companyName = firstExperience ? firstExperience.company : '';
//     leadData.linkedinUrl = link;

//     try {
//         const response = await axios.post(`https://apiv2.lagrowthmachine.com/flow/leads?apikey=${apiKey}`, leadData);

//         console.log(response.data);
//     } catch (error) {
//         console.error(error);
//     }
// }

// // Appel de la fonction pour récupérer les données
// fetchProfilePicture().then(() => {
//     // Appel de la fonction pour mettre à jour Google Sheet
//     updateGoogleSheet().then(() => {
//         // Appel de la fonction pour créer le lead après 60 secondes
//         // createLead();
//         console.log('Fin du script.');
//     });
// });
