import { fetchProfilePicture,updateSearchLink } from "@/js/addSheet";
import axios from "axios";
import * as csv from 'csv-parse';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


async function SheetFunction () {
    //------------------------ Récupération des données de l'agent Phantombuster  ------------------------//
    // Récupérer les données de l'agent
    console.log('Récupération des données de l\'agent...');
    const {data: { containerId, output } } = await axios.get(`https://api.phantombuster.com/api/v2/agents/fetch-output`, {
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
    csv.parse(csvData, {columns: true}, (err, records) => {
    if (err) {
        console.error(err);
        return;
    }

    for (let record of records) {
        let link = record.profileUrl;
        if (link.startsWith('https://www.linkedin.com/in/')) {
            profileLinks.push(link);
        }
    }
        console.log('Nombre de liens de profil :', profileLinks.length);
        profileLinks.reverse().forEach((link, index) => { 
            if ((index + 1) <= 1) {
                console.log('Lien de profil n°', index, ':', link);
                fetchProfilePicture(link);
            }
        });
    });
}

export async function SearchFunction (url) {
    //------------------------ Lancement de l'agent Phantombuster  ------------------------//
    // Mettre à jour le lien de la recherche dans Google Sheet
    await updateSearchLink(url)
    try {
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
         let initialTimer = 2 * 60;
         const interval = setInterval(() => {
            initialTimer--;

            if (initialTimer < 0) {
                clearInterval(interval);
                SheetFunction();
            } else {
                console.log(`Lancement du sheetFunction dans ${initialTimer + 1} secondes`);
            }
        }, 1000);
    } catch (error) {
       console.log(`lancement agent phantombuster echouer => ${error}`); 
    }
}