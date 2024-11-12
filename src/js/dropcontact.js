import axios from 'axios';
import creds from '../json/credentials.json' assert { type: 'json' };
import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { getDataFromSheetEmailInstantly } from './instantly.js';
import { addLeads } from './instantly.js';
import { readAPI, writeAPI } from './apiLimiter.js';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import { config } from 'dotenv';
import { getSignature } from '@/libs/signature';
import { iteration } from './TestGPT.js';
config();


const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY,
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets',
  ],
});


const getUserInfos = () => {
  const v = getSignature()
  if (v === 'Reigner') {
      return {
          email: 'vincent.ducastel@helpline.fr',
          password: 'Cookietsuki98!',
          from: 'DUCASTEL Vincent <vincent.ducastel@helpline.fr>',
          signature: 'Hubert Reigner'
      };
  }
  if (v === 'Aboulhadid') {
      return {
        email: 'vincent.ducastel@helpline.fr',
        password: 'Cookietsuki98!',
        from: 'DUCASTEL Vincent <vincent.ducastel@helpline.fr>',
        signature: 'Ahmed Aboulhadid'
    };
  }
  if (v === 'Nouet') {
      return {
        email: 'vincent.ducastel@helpline.fr',
        password: 'Cookietsuki98!',
        from: 'DUCASTEL Vincent <vincent.ducastel@helpline.fr>',
        signature: 'Charles Nouet'
    };  
  }
}

export async function findEmail(data, link) {
  const { first_name, last_name, experiences } = data
  console.log("find email company", experiences[0]?.company)
  console.log("find email company Linkedin",experiences[0]?.company_linkedin_profile_url)
  try {
    const response = await axios.post('https://api.dropcontact.io/batch', {
      data: [
        {
          first_name: first_name,
          last_name: last_name,
          full_name: `${first_name} ${last_name}`,
          company: experiences[0]?.company,
          company_linkedin: experiences[0]?.company_linkedin_profile_url,
          linkedin: link
        }
      ],
      siren: true,
      language: 'en'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': 'gJkIWMJRLpplPYtGWdJrYS3hfxsThW'
      }
    });

    const requestId = response.data.request_id;

    console.log('Waiting for results...');
    await countDown();
    console.log('Fetching results...');
    
    const result = await getResults(requestId);
    
    if (result && result.length > 0 && result[0].email && result[0].email.length > 0) {
      const emailAddress = result[0].email[0].email;
      console.log('Email found:', emailAddress);
      return emailAddress;
    
    } else {
      console.log('No email found.');
      return undefined;
    }
  } catch (error) {
    console.error('Error finding email:', error);
    return undefined
  }
}

async function getResults(requestId) {
  try {
    const response = await axios.get(`https://api.dropcontact.io/batch/${requestId}?forceResults=true`, {
      headers: {
        'X-Access-Token': 'gJkIWMJRLpplPYtGWdJrYS3hfxsThW'
      }
    });

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error('Results not ready yet. Please try again later.');
    }
  } catch (error) {
    console.error('Error getting results:', error);
    throw new Error('Error getting results. Please try again.');
  }
}

function countDown() {
  return new Promise((resolve, reject) => {
    let count = 60;
    const interval = setInterval(() => {
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      process.stdout.write(`Countdown: ${count--}`);
      if (count < 0) {
        clearInterval(interval);
        process.stdout.write('\n');
        resolve();
      }
    }, 1000);
  });
}


