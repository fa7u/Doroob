
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc } = require('firebase/firestore');
const fs = require('fs');

async function getInvestments() {
    const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

    try {
        const docRef = doc(db, 'settings', 'investments');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            const items = data.items || [];
            const result = items.map(item => ({
                id: item.id,
                name: item.name,
                image: item.image ? (item.image.substring(0, 50) + "...") : "No Image"
            }));
            console.log(JSON.stringify(result, null, 2));
        } else {
            console.log("No such document!");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

getInvestments();
