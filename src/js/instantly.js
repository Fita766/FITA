import fetch from 'node-fetch';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const dotenv = require('dotenv'); 
dotenv.config(); 

export async function addLeads(profile) {
    try {
        const { personality, firstMail, secondMail, thirdMail, email, data } = profile
        const { first_name, last_name, occupation, experiences } = data
        console.log("Nom:", last_name);
        console.log("Prenom:", first_name);
        console.log("Entreprise:", experiences[0]?.company);
        console.log("Fonction:", occupation || undefined);
        console.log("firstMail:", !!personality);
        console.log("firstMail:", !!firstMail);
        console.log("secondtMail:", !!secondMail);
        console.log("thirdtMail:", !!thirdMail);
        console.log("email:", !!email);

        if (!first_name || !last_name || !email || !personality || !firstMail || !secondMail || !thirdMail) {
            console.error("Une ou plusieurs variablses sont indéfinies !");
            return;
        }
        console.log("lancement instantly addlead");

        // Données de la requête
        const value = {
            "api_key": "s3h7wdhabtmxz2gxphbr77b7v8z4",
            "campaign_id": "31ff0d72-0229-4911-9491-301836f80fa1",
            "skip_if_in_workspace": false,
            "leads": [
                {
                    "email": email,
                    "first_name": first_name,
                    "last_name": last_name,
                    "company_name": experiences[0]?.company,
                    "personalization": "",
                    "phone": "",
                    "website": "",
                    "custom_variables": {
                        "Fonction": occupation || undefined,
                        "Emailpersonalise": firstMail,
                        "Emailrelance1": secondMail,
                        "Emailrelance2": thirdMail,
                        "personality": personality,
                    }
                }
            ]
        }
        const raw = JSON.stringify(value);
        // Options de la requête
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(raw) // Ajout de la longueur du corps de la requête
            },
            body: raw,
            redirect: 'follow'
        };

            const response = await fetch("https://api.instantly.ai/api/v1/lead/add", requestOptions);

            if (!response.ok) {
                throw new Error(`Erreur HTTP ! Status : ${response.status}`);
            }

        const result = await response.text();
        console.log(result);
        return value.leads[0]
    } catch (error) {
        console.error('Erreur :', error);
    }
    
}



const getUserTxt = (v) => {
    if (!v) {
        // ici message par dauflt
    }
    if (v === 'Reigner') {
        return "Hubert Reigner";
    }
    if (v === 'Aboulhadid') {
        return "Ahmed Aboulhadid";
    }
    if (v === 'Nouet') {
        return "Charles Nouet"; 
    }
}
