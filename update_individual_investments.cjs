
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, writeBatch, collection } = require('firebase/firestore');
const fs = require('fs');

async function forceUpdate() {
    const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
    const newItems = JSON.parse(fs.readFileSync('formatted_investments.json', 'utf8'));

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

    console.log("Starting forceful Firestore update for 30 individual investments...");

    const batch = writeBatch(db);
    const investCol = collection(db, 'investments');

    newItems.forEach((item) => {
        const itemRef = doc(investCol, `item_${item.id}`);
        // We set only id and image, effectively removing name if it existed
        batch.set(itemRef, {
            id: item.id,
            image: item.image,
            updatedAt: new Date().toISOString()
        }, { merge: false }); // merge: false to overwrite and remove any extra fields like 'name'
    });

    try {
        await batch.commit();
        console.log("SUCCESS: 30 investments updated forcefully (names removed).");
    } catch (error) {
        console.error("FORCE UPDATE FAILED:", error);
    }
}

forceUpdate();
