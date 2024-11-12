import axios from 'axios';
import fs from 'fs/promises';
import { readAPI, writeAPI } from './apiLimiter.js'; // Assurez-vous que ces fonctions fonctionnent correctement pour gérer les appels API
import { getFirstEmail, getPersonality, getSecondEmail, getThirdEmail } from './TestGPT.js';
import { findEmail } from './dropcontact.js';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
require('dotenv').config();
const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY,
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets',
  ],
});

const GPTAPI = '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'; // Clé API OpenAI

export async function fetchProfilePicture(link) {
    try {
        const { data, error } = await axios.get('https://nubela.co/proxycurl/api/v2/linkedin', {
            params: {
                'linkedin_profile_url': link,
            },
            headers: {
                'Authorization': 'Bearer joE7mVqkxjuPXlNS9kmtHA',
            },
        });

        if (!data) {
            console.log(error);
            return;
        }

        const email = await findEmail(data, link);
        if (!email) {
            console.error('email non trouver');
            return
        };
        const personality = await getPersonality(data);
        if (!personality) {
            console.error('personality par gpt vide');
            return
        };

        const firstMail = await getFirstEmail(personality, data);
        if (!firstMail) {
            console.error('emailContent 1 par gpt vide');
            return
        };

        const secondMail = await getSecondEmail(firstMail);
        if (!secondMail) {
            console.error('emailContent 2 par gpt vide');
            return
        };

        const thirdMail = await getThirdEmail(firstMail, secondMail, personality, data);
        if (!thirdMail) {
            console.error('emailContent 3 par gpt vide');
            return
        };

        return { personality, firstMail, secondMail, thirdMail, email, data };
    } catch (error) {
        console.error(error);
    }
}

export async function updateSearchLink (link) { 
    const doc = new GoogleSpreadsheet('1Ypkfu2mehLVKP1M5F3sDKQmuwOWC3elYNwKdrVu0Y-c', serviceAccountAuth);
    
    try {
        await readAPI(() => doc.loadInfo());
        const sheet = await readAPI(() => doc.sheetsByIndex[ 0 ]);
        await readAPI(() => sheet.clear());
        // Remplacement du lien
        await readAPI(() => sheet.loadCells('A1:E10'));
        const a1 = await readAPI(() => sheet.getCell(0, 0));

        a1.value = link || linkDefault;
        // Mis à jour du Google Sheet
        await writeAPI(() => sheet.saveUpdatedCells());
        console.log('Données ajoutées à Google Sheet avec succès.');
    } catch (error) {
        console.error('Erreur lors de la mise à jour de Google Sheet:', error);
    }

}



