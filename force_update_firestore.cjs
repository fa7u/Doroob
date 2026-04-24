const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, writeBatch, collection } = require('firebase/firestore');
const fs = require('fs');

async function forceUpdate() {
    const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
    const newItems = JSON.parse(fs.readFileSync('formatted_investments.json', 'utf8'));

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

    console.log("Starting forceful Firestore update for 30 investments...");

    const batch = writeBatch(db);
    const investCol = collection(db, 'investments');

    // Prepare items for settings document (names removed)
    const settingsItems = newItems.map(item => ({
        id: item.id,
        image: item.image
    }));

    // Update individual investment documents
    newItems.forEach((item) => {
        const itemRef = doc(investCol, `item_${item.id}`);
        batch.set(itemRef, {
            id: item.id,
            image: item.image,
            updatedAt: new Date().toISOString()
        }, { merge: true });
    });

    // Update settings document
    const settingsRef = doc(db, 'settings', 'investments');
    batch.update(settingsRef, { items: settingsItems });

    try {
        await batch.commit();
        console.log("SUCCESS: 30 investments updated forcefully and 'name' removed from settings.");
    } catch (error) {
        console.error("FORCE UPDATE FAILED:", error);
    }
}

forceUpdate();
