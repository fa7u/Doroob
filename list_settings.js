
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function listSettingsInvestments() {
    try {
        const settingsDoc = await getDoc(doc(db, 'settings', 'investments'));
        if (settingsDoc.exists()) {
            const items = settingsDoc.data().items || [];
            items.forEach((item, index) => {
                console.log(`Item Order: ${index + 1}`);
                console.log(`ID: ${item.id}`);
                console.log(`Name: ${item.name || 'N/A'}`);
                console.log(`Image: ${item.image ? (item.image.substring(0, 50) + '...') : 'No Image'}`);
                console.log('---');
            });
        } else {
            console.log("Settings document not found.");
        }
    } catch (e) {
        console.error("Error:", e.message);
    }
    process.exit(0);
}

listSettingsInvestments();
