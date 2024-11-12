import { fetchProfilePicture,updateSearchLink } from "@/js/addSheet";
import axios from "axios";
import * as csv from 'csv-parse';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import { readAPI, writeAPI } from './apiLimiter.js';

import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { addLeads } from "./instantly.js";
require('dotenv').config();
const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY,
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets',
  ],
});

async function SheetFunction() {
    //------------------------ Récupération des données de l'agent Phantombuster  ------------------------//
    // Récupérer les données de l'agent
    console.log('Récupération des données de l\'agent...');
    const { data: { containerId, output } } = await axios.get(`https://api.phantombuster.com/api/v2/agents/fetch-output`, {
        params: {
            id: "1514521147891462"
        },
        headers: {
            'X-Phantombuster-Key-1': 'hUmnJfOWVTKsfTPjcmEPkfqmtvmqNyOXqJctHlSP2dM'
        }
    });
    console.log('Réponse de récupération :', containerId);

    const lines = output.split('\n');
    let csvLink, jsonLink;

    for (let line of lines) {
        if (line.includes('CSV saved at')) {
            csvLink = line.split(' ')[4];
        } else if (line.includes('JSON saved at')) {
            jsonLink = line.split(' ')[4];
        }
    }

    // Récupérer les liens du CSV
    console.log('Récupération des liens du CSV...');
    let csvResponse = await axios.get(csvLink);
    // console.log('Réponse CSV :', csvResponse.data);

    let csvData = csvResponse.data;

    let profileLinks = [];
    const results = [];

    await new Promise((resolve, reject) => {
        csv.parse(csvData, { columns: true }, async (err, records) => {
            if (err) {
                console.error(err);
                reject(err);
                return;
            }

            for (let record of records) {
                let link = record.profileUrl;
                if (link.startsWith('https://www.linkedin.com/in/')) {
                    profileLinks.push(link);
                }
            }

            const filteredLinks = profileLinks.reverse().filter((_, i) => i < 2);

            for (const [index, link] of filteredLinks.entries()) {
                console.log('Lien de profil n°', index + 1, ':', link);
                try {
                    const profile = await fetchProfilePicture(link);
                    if (!profile) continue;
                    const result = await addLeads(profile);
                    if (result !== undefined) {
                        results.push(result);
                    }
                    
                } catch (error) {
                    console.error('Erreur lors de la récupération du profil:', error);
                }
            }

            resolve();
        });
    });

    console.log(results);
    

    return results;
}



async function startCountdown() {
    let initialTimer = 120;
    while (initialTimer > 0) {
       process.stdout.write(`\rLancement du sheetFunction dans ${initialTimer + 1} secondes `);
        await new Promise(resolve => setTimeout(resolve, 1000));
        initialTimer--;
    }
}


export async function SearchFunction (url) {
    //------------------------ Lancement de l'agent Phantombuster  ------------------------//
    // Mettre à jour le lien de la recherche dans Google Sheet
    try {
        await updateSearchLink(url)
        await axios.post('https://api.phantombuster.com/api/v2/agents/launch', {
            id: "1514521147891462",
            sessionCookie: "AQEDATRvsq0Be6ZgAAABjEOz-FQAAAGMi8lzQVYAZntB2_9kQoR0ilC7g-_TuNudCf9ibloi9wPfSISYwKQK--R-onBGZ-YpBsw4pMFLqxK-jzdoYcuLLE9E_Uyom8f-qM41-shgvNCfq8tiJNf8SJmg",
            columnName: "profileUrl",
        }, {
            headers: {
                'X-Phantombuster-Key-1': 'hUmnJfOWVTKsfTPjcmEPkfqmtvmqNyOXqJctHlSP2dM'
            }
        });
         console.log('Lancement agent phantombuster reussit');
        //  initialisation du timer => min - sec
        await startCountdown();
        return await SheetFunction();

    } catch (error) {
       console.log(`lancement agent phantombuster echouer => ${error}`); 
    }
}


// async function checkClientExistence(rows, record) {
//     for (let row of rows) {
//         if (row.Nom === record.firstName && row.Prenom === record.lastName) {
//             console.log("Le client existe déjà.");
//             return "Le client existe déjà."; // ne pas envoyer cette URL à fetchProfilePicture
//         }
//     }
//     console.log("Pas client");
//     return "Pas client";
// }

// export async function verifClient(link, record) {
//     const doc = new GoogleSpreadsheet('12y83tLwlU_6ewO14Lob4gwL5Cl6adH1MekItJZgs0OQ', serviceAccountAuth);
//     console.log("lancement verifClient");
//     console.log(record.firstName);
//     console.log(record.lastName);

//     try {
//         await readAPI(() => doc.loadInfo());
//         const sheet = await readAPI(() => doc.sheetsByIndex[1]); // Assurez-vous d'avoir la bonne feuille
//         const rows = await readAPI(() => sheet.getRows()); // Récupère toutes les lignes

//         const result = await readAPI(() => checkClientExistence(rows, record));
//         return result;
//     } catch (error) {
//         console.error('Erreur lors de la récupération des données depuis Google Sheet verifClient recupsearch :', error);
//     }
// }