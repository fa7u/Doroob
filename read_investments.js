
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function checkData() {
    console.log("Checking /settings/investments document...");
    try {
        const settingsDoc = await getDoc(doc(db, 'settings', 'investments'));
        if (settingsDoc.exists()) {
            console.log("Found /settings/investments document.");
            const data = settingsDoc.data();
            console.log(JSON.stringify(data, null, 2));
        } else {
            console.log("/settings/investments document does not exist.");
        }
    } catch (e) {
        console.error("Error reading /settings/investments:", e.message);
    }

    console.log("\nChecking /investments collection...");
    try {
        const investmentsSnap = await getDocs(collection(db, 'investments'));
        investmentsSnap.forEach(doc => {
            console.log(`Document ID: ${doc.id}`);
            console.log(JSON.stringify(doc.data(), null, 2));
        });
    } catch (e) {
        console.error("Error reading /investments collection:", e.message);
    }
    process.exit(0);
}

checkData();
