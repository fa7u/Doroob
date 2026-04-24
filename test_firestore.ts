import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDocFromServer } from 'firebase/firestore';
import * as fs from 'fs';

async function test() {
    const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

    console.log("Testing connection...");
    try {
        await getDocFromServer(doc(db, 'test', 'connection'));
        console.log("Connection test document fetch attempt finished (ignore result).");
    } catch (e) {
        console.error("Connection test failed:", e);
    }

    const investCol = collection(db, 'investments');
    try {
        const snapshot = await getDocs(investCol);
        console.log(`Successfully fetched ${snapshot.size} documents from investments.`);
    } catch (error) {
        console.error("READ FAILED:", error);
    }
}

test();
