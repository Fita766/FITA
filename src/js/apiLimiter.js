// C:\Users\VDUCASGA\OneDrive - HELPLINE\SUC PROCESS AUTOMATION\fitta\src\js\apiLimiter.js

let readCount = 0;
let writeCount = 0;
const readLimit = 20;
const writeLimit = 20;
const resetTime = 60000; // 60 seconds

function resetCounters() {
    readCount = 0;
    writeCount = 0;
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function limitCheck() {
    if (readCount >= readLimit || writeCount >= writeLimit) {
        console.log(`Rate limit reached. Pausing for ${resetTime / 1000} seconds...`);
        await delay(resetTime);
        resetCounters();
    }
}

async function readAPI(callFunction) {
    await limitCheck();
    readCount++;
    return callFunction();
}

async function writeAPI(callFunction) {
    await limitCheck();
    writeCount++;
    return callFunction();
}

export { readAPI, writeAPI };
