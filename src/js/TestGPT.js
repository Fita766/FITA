import creds from '../json/credentials.json' assert { type: 'json' };
import axios from 'axios';
import fs from 'fs/promises';
import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import OpenAI from "openai";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import { getDataFromSheetDropcontact } from './dropcontact.js';
import { config } from 'dotenv';
import { getSignature } from '@/libs/signature';
import { getExpertise } from '@/libs/expertise';
import { readAPI, writeAPI } from './apiLimiter.js';

var  recupEnjeux1 = undefined;
var  recupEnjeux2 = undefined;
var  recupEnjeux3 = undefined;

const GPTAPI = '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';

config();





export async function getPersonality(data) {
 const { occupation, experiences, education} = data;
    const exp = experiences?.map(v => ({ company: v?.company, fn: v?.title, resume:v?.description }))
    console.log("Lancement Personalité")
    try {
        const openai = new OpenAI({ apiKey: GPTAPI });
        

         const { choices: [{ message: { content: personality }}]} =  await openai.chat.completions.create({
            messages: [{ role: "system", content: `Definie moi la personnalité de cette personne qui est mon prospect: \nFonction: ${occupation} \nEntreprise : ${exp[0]?.company} \n daterange : ${experiences[0]?.starts_at?.year}  \nDescription : ${exp[0]?.resume} \n
            ${exp?.map((v,i) =>
              `Experience N-${i+1} : ${v.company ? 'Entreprise :' + v.company : ""}, ${v.fn ? 'Fonction :' + v.fn : ""}, ${v.resume ? 'Description :' + v.resume : ""} \n`
            )} \n
            Education : ${education[0]?.degree_name} à l'école ${education[0]?.school} \nDate de fin : ${education[0]?.ends_at}` }],
            model: "ft:gpt-3.5-turbo-1106:personal::8nNDLPMx",
        });
        return personality;
    } catch (error) {
        console.error('Erreur lors de l\'envoi du prompt au modèle :', error);
    }
}

const getUserTxt = (v) => {
    if (!v) {
        // ici message par dauflt
    }
    if (v === 'Reigner') {
        return "Je suis Hubert REIGNER et je suis le directeur chez Size Up Consulting";
    }
    if (v === 'Aboulhadid') {
        return "Je suis Marie Dirand et je suis ingenieur d'affaires ";
    }
    if (v === 'Nouet') {
        return "Je suis Charles NOUET et je suis directeur d'agence chez Size Up Consulting"; 
    }
}

const getEnjeux2 = (n) => {
    // switch (n) {
    //     case "Data":
            
    //         break;
    //     case "Devops":

    //         break;
    //     default:
    //         break;
    // }
    if (!n) {
        // ici message par dauflt
    }
    if (n === 'Data') {
        return "de la data"
    }
    if (n === 'Devops') {
        return "du DevOps"
    }
    if (n === 'Support Utilisateur') {
        return "du Support Utilisateur"
    }
}

// export async function getFirstEmail(prenom, nom, entreprise, fonction, personalite, Diplome, Ecole, Description, Localisation, Entreprise2, Fonction2, Description2, Entreprise3, Fonction3, Description3, Entreprise4, Fonction4, Description4, Entreprise5, Fonction5, Description5, Nom_connaissance1, Fonction_connaissance1, Nom_connaissance2, Fonction_connaissance2, Nom_connaissance3, Fonction_connaissance3, Nom_connaissance4, Fonction_connaissance4, Nom_connaissance5, Fonction_connaissance5, Groupe1, Groupe2, Groupe3, Groupe4, Groupe5, iteration) {
export async function getFirstEmail(personality, data) {
    const { first_name, last_name, occupation, summary, experiences, education, groups, city  } = data;
    const exp = experiences?.map(v => ({ company: v?.company, fn: v?.title, resume:v?.description }))
    const groupNames = groups?.map(v => v?.name);
    console.log("Lancement Email")
    try {
        const openai = new OpenAI({ apiKey: GPTAPI });
        const signature = getUserTxt(getSignature())
        const customEnjeux2 = getEnjeux2(getExpertise())
        const { choices: [{ message: { content: mailContent }}]} = await openai.chat.completions.create({
            messages: [{ role: "system", content: `
            > Rôle : Tu es un copywriter spécialisé en emailing.
            > Ton profil avec lequels tu dois signer : ${signature};
            > Contexte : Ton entreprise est un prestataire de service dans l'univers ${customEnjeux2}.
            > Tâche : Tu écris un email persuasif.
            > Tonalité : ton professionnel B2B qui doit faire comme si nous parlions a l'oral
            Je souhaite [planifier un appel]. Aide-moi à rédiger un courriel personnalisé et engageant qui va droit au but, respecte la règle du 2:1 (qui parle deux fois plus du client potentiel que de moi), contient un appel à l'action fort, ne me dévalorise pas : c'est-à-dire qu'il n'utilise pas d'expressions telles que "désolé de vous déranger" ou "je ne veux pas prendre trop de temps", se concentre sur UN avantage clé de travailler avec moi, et enfin contient un maximum de 200 mots.
            
            Voici le profil de ton prospect :

            ///
            Prenom : ${first_name}
            Nom : ${last_name}
            Entreprise actuelle : ${exp[0]?.company}
            Fonction actuelle : ${occupation}
            Description actuelle : ${exp[0]?.resume}
            Sommaire de son profil Linkedin : ${summary} 
            Localisation : ${city}
            ${exp?.map((v,i) =>
              `Experience N-${i+1} : ${v.company ? 'Entreprise :' + v.company : ""}, ${v.fn ? 'Fonction :' + v.fn : ""}, ${v.resume ? 'Description :' + v.resume : ""} \n`
            )}
            Etude : ${education[0]?.degree_name} à ${education[0]?.school},
            Groupe auquel il appartient sur linkedin : ${groupNames.join(', ')}

            /// Voici les informations sur ton entreprise : 
            Entreprise : Helpline accompagne plus de 150 clients dans la transformation de leur service desk en AT et en infogérance (ex: Support bureautique/ applicatif, l’ingénierie du poste de travail et la gestion des infrastructures....) et obtient un taux de renouvellement de ses contrats de 97%.


            
            > Contrainte : 
             - Format court = 2 paragraphes de 3 lignes max
             - écris l email de manière naturelle, sans mentionner la structure rhétorique.
             - Rappel toi que tu fais un email ultra personnalisé par rapport au profils que je t'ai donné
             - Commence par un icebreaker exemple: Comment faites vous pour faire face à ... ? 
             - Il faut également que tu justifie le contact, exemple: "j'ai vu que vous etiez en charge de" sans valoriser son parcours ou sont entreprise !!!
             - Ne met pas d'objet, l'email doit etre pret a l'envoie.
             - N'invente pas de cas client que je ne t'ai pas donné
             - Important: Tu dois te baser sur la personnalité de ton prospect
             - Tu ne valorise pas le prospect ("C'est impressionnant votre... J'admire vos...")
             - Personnalise au maximum l'email avec les informations que je t'ai donné sur le prospect et le secteur.
             - ${personality}
             - Utilisez des “Si”
             - Demandez l’avis de votre interlocuteur
             - Remplacez-les “Vous avez” par des “J’ai imaginé que”
             - Ne dites pas "quel est le meilleur moment pour vous appeler ?" mais “Est-ce que vous pensez qu’en discuter 5 min pourrait être intéressant ?”
             - Adaptez votre conjugaison : "peut" → "pourrait"
             - Remplacez "Quand pouvez-vous... ?" par "Est-ce que ça aurait du sens de…?"
             - Utilisez des mots comme “éventuellement”, “peut-être”,…
             - Ne cite pas une fois Helpline ! 
             - Pose une seule question, pas plusieurs dans le meme email !
             - Ne fait pas des paragraphes trop compact. Fais en sorte que ton mail soit aéré.
                ` }],
            model: "gpt-3.5-turbo",
        });
        return mailContent;  
    } catch (error) {
        console.error('Erreur lors de l\'envoi du prompt au modèle :', error);
    }
}

export async function getSecondEmail(firstMail) {
    console.log("Lancement EmailRelance1")
    try {
        const openai = new OpenAI({ apiKey: GPTAPI });  
     
        const { choices: [{ message: { content: mailContent }}]} = await openai.chat.completions.create({
            messages: [{ role: "system", content: `
            > Rôle : Tu es un copywriter spécialisé en emailing.
            Tu dois écrire un mail de relance J+3.

            Voici le mail que tu as déjà envoyé : 
            ${firstMail}

            Format court = 2 paragraphes de 3 lignes max

            > Contrainte : écris l email de manière naturelle, sans mentionner la structure rhétorique.
             - Ne met pas d'objet, l'email doit etre pret a l'envoie.
             - N'invente pas de cas client que je ne t'ai pas donné
             - Important: Tu dois te baser sur sa Personnalité
             - Utilisez des “Si”
             - Demandez l’avis de votre interlocuteur
             - Remplacez-les “Vous avez” par des “J’ai imaginé que”
             - Dites carrément que vous pouvez vous tromper : “Je peux me tromper”, “Je ne suis pas sûr”, “Je fais peut-être fausse route”
             - Ne dites pas "quel est le meilleur moment pour vous appeler ?" mais “Est-ce que vous pensez qu’en discuter 5 min pourrait être intéressant ?”
             - Adaptez votre conjugaison : "peut" → "pourrait"
             - Remplacez "Quand pouvez-vous... ?" par "Est-ce que ça aurait du sens de…?"
             - Utilisez des mots comme “éventuellement”, “peut-être”,…
             - Ne fait pas des paragraphes trop compact. Fais en sorte que ton mail soit aéré.
                ` }],
            model: "gpt-3.5-turbo",
        });

        return mailContent;
    } catch (error) {
        console.error('Erreur lors de l\'envoi du prompt au modèle :', error);
    }
}

export async function getThirdEmail(firstMail, secondMail) {
    console.log("Lancement EmailRelance2")
    try {
        const openai = new OpenAI({ apiKey: GPTAPI });  
     
       const { choices: [{ message: { content: mailContent }}]} = await openai.chat.completions.create({
            messages: [{ role: "system", content: `

            > Rôle : Tu es un copywriter spécialisé en emailing.
            Tu dois écrire un mail de relance J+8. Base toi sur les enjeux du moment et essaye de le persuader en disant que cela serait interessant d'echanger.

            Voici les mails que tu as déjà envoyé : 
            
            Premier email :${firstMail}

            Relance J+3 : ${secondMail}
            
            Format court = 2 paragraphes de 3 lignes max

            > Contrainte : écris l email de manière naturelle, sans mentionner la structure rhétorique.
             - Ne met pas d'objet, l'email doit etre pret a l'envoie.
             - N'invente pas de cas client que je ne t'ai pas donné
             - Important: Tu dois te baser sur sa Personnalité
             - Soit différents des emails que tu as fait
             - Ne fait pas des paragraphes trop compact. Fais en sorte que ton mail soit aéré.`}],
            model: "gpt-3.5-turbo",
        });

        return mailContent;
    } catch (error) {
        console.error('Erreur lors de l\'envoi du prompt au modèle :', error);
    }
}

// const serviceAccountAuth = new JWT({
//     email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
//     key: process.env.GOOGLE_PRIVATE_KEY,
//     scopes: [
//       'https://www.googleapis.com/auth/spreadsheets',
//     ],
//   });

//   const getEnjeux = (n) => {
//     if (!n) {
//         // ici message par dauflt
//     }
//     if (n === 'Data') {
//         recupEnjeux1 = [1 , 1];
//         recupEnjeux2 = [2 , 1];
//         recupEnjeux3 = [3 , 1];
//     }
//     if (n === 'Devops') {
//         recupEnjeux1 = [1 , 2];
//         recupEnjeux2 = [2 , 2];
//         recupEnjeux3 = [3 , 2];
//     }
//     if (n === 'Support Utilisateur') {
//         recupEnjeux1 = [1 , 3];
//         recupEnjeux2 = [2 , 3];
//         recupEnjeux3 = [3 , 3];
//     }
// }

// function sleep(seconds) {
//     return new Promise(resolve => setTimeout(resolve, seconds * 1000));
// }

//   export async function getDataEnjeux(iteration) {
//     console.log('recuperation des enjeux')
//     const doc = new GoogleSpreadsheet('1tWU8ZvxA5S6zsvSIE6Tyfk5C3uUhC7JNkm_StPi4LYk', serviceAccountAuth);
//     const customEnjeux = getEnjeux(getExpertise())
//     console.log(recupEnjeux1, recupEnjeux2, recupEnjeux3)


//     try {
//         await readAPI(() => doc.loadInfo());
//         const sheet = await readAPI(() => doc.sheetsByIndex[0]);
//         await readAPI(() => sheet.loadCells(`A1:D4`));


//         const Enjeux1 = await readAPI(() => sheet.getCell(...recupEnjeux1).value);
//         const Enjeux2 = await readAPI(() => sheet.getCell(...recupEnjeux2).value);
//         const Enjeux3 = await readAPI(() => sheet.getCell(...recupEnjeux3).value);


//         console.log("recuperation des enjeux avec succes")
//         // await sleep(60);
//         await getDataFromSheet(iteration);
//     } catch (error) {
//         console.error('Erreur lors de la récupération des données depuis Google Sheet:', error);
//     }
// }
