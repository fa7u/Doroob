
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, updateDoc, getDoc } = require('firebase/firestore');
const fs = require('fs');

async function updateSettings() {
    const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
    // Read local cleaned data
    const cleanedItems = JSON.parse(fs.readFileSync('formatted_investments.json', 'utf8'));

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

    console.log("Attempting to update settings/investments without 'name' field...");

    try {
        const settingsRef = doc(db, 'settings', 'investments');
        await updateDoc(settingsRef, {
            items: cleanedItems
        });
        console.log("SUCCESS: settings/investments updated (names removed).");
    } catch (error) {
        if (error.message.includes('exceeds the maximum allowed size')) {
            console.error("FAILED: Document size limit reached (1MB). We need to decouple images from the settings list.");
        } else {
            console.error("FAILED:", error.message);
        }
    }
}

updateSettings();
