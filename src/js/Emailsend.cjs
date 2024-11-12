const nodemailer = require('nodemailer');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
import { iteration } from './TestGPT.js';
const { readAPI, writeAPI } = require('./apiLimiter');


process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const headers = ['Nom', 'Prenom', 'Fonction', 'Entreprise', 'Email', 'Personalité', 'Email_Envoyé', "Date_Envoi", 'Fait_Par' ] ;

const dotenv = require('dotenv'); 
dotenv.config(); 


const serviceAccountAuth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY,
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
    ],
  });

 export async function getDataFromSheetEmail(mailsUser, iteration) {
    const doc = new GoogleSpreadsheet('1wApnLeSHib2ni74gVpN-zhRrH02lUWt6V-c_J3Gx-rE', serviceAccountAuth);
    console.log("fonction envoie email");

    try {
        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0];
        await sheet.loadCells(`A1:EW${iteration + 1}`);


        const cellemailpersonalise = sheet.getCell(iteration, 148).value;
        const cellemail = sheet.getCell(iteration, 150).value;

        console.log("recuperation sheet1 for send email succes")
        sendToEmailSender(cellemailpersonalise, cellemail, mailsUser, iteration);
    } catch (error) {
        console.error('Erreur lors de la récupération des données depuis Google Sheet for send email :', error);
    }
}




async function sendToEmailSender(cellemailpersonalise, cellemail, mailsUser,iteration) {
  // Configuration du transport SMTP pour Hotmail
  let transporter = nodemailer.createTransport({
      service: 'hotmail',
      auth: {
        //   user: mailsUser.email,
        //   pass: mailsUser.password
          user: 'vincent.ducastel@helpline.fr',
          pass: 'Cookietsuki98!'
      }
  });

  // Définition des options de l'e-mail avec les valeurs récupérées
  let mailOptions = {
    //   from: mailsUser.from,
    //   to: cellemail, 
    //   subject: "Email ?",
    //   text: cellemailpersonalise 
    from: "vincent.ducastel@helpline.fr",
      to: 'vincent.ducastel@helpline.fr', 
      subject: "Email ?",
      text: cellemailpersonalise 
  };

  // Envoi de l'e-mail
  transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
          console.log(error);
      } else {
          console.log('E-mail envoyé: ' + info.response);
          RecupProspectContact(mailsUser, iteration);
      }
  });
}

export async function RecupProspectContact(mailsUser, iteration) {

  const doc = new GoogleSpreadsheet('1wApnLeSHib2ni74gVpN-zhRrH02lUWt6V-c_J3Gx-rE', serviceAccountAuth);
  console.log("lancement RecupProspectContact")

  try {
      await doc.loadInfo();
      const sheet = doc.sheetsByIndex[0];
      await sheet.loadCells(`A1:EW${iteration + 1}`);

      const cellNom = sheet.getCell(iteration, 2).value;
      const cellPrenom = sheet.getCell(iteration, 1).value;
      const cellEntreprise = sheet.getCell(iteration, 6).value;
      const cellFonction = sheet.getCell(iteration, 7).value;
      const cellpersonalite = sheet.getCell(iteration, 149).value;
      const cellemailpersonalise = sheet.getCell(iteration, 148).value;
      const cellemail = sheet.getCell(iteration, 150).value;

      console.log("recuperation RecupProspectContact")
      await PushCentralisationProspects(cellNom, cellPrenom, cellEntreprise, cellFonction, cellemail, cellpersonalite, cellemailpersonalise,mailsUser, iteration);
  } catch (error) {
      console.error('Erreur lors de la récupération des données depuis Google Sheet RecupProspectContact :', error);
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

async function PushCentralisationProspects(Nom, Prenom, Entreprise, Fonction, Email, Personalite, Emailpersonalise, mailsUser,  iteration) {
  const doc = new GoogleSpreadsheet('14PR1RJGc4svR8Z8HW9M2-guOWctmSWva6iYa_IcC2IU', serviceAccountAuth);
  console.log("lancement PushCentralisationProspects")
  
  try {
      await doc.loadInfo();
      const sheet = doc.sheetsByIndex[0];
      // Ajout des headers
      sheet.setHeaderRow(headers);

      // Préparation des données pour une ligne
      const rowData = {
          Nom : Nom,
          Prenom: Prenom,
          Fonction: Fonction,
          Entreprise: Entreprise,
          Email: Email,
          Personalité : Personalite,
          Email_Envoyé: Emailpersonalise,
          Date_Envoi: new Date(),
          Fait_Par: mailsUser.signature,


      };
      await sheet.addRow(rowData);
      

      console.log('Données ajoutées à Google Sheet Prospect Contacté SUC FITTA avec succès.');
      console.log('Fin du prospectc');
  } catch (error) {
      console.error('Erreur lors de la mise à jour de Google Sheet Prospect Contacté SUC FITTA:', error);
  }
}