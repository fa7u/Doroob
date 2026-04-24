
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, orderBy, query } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function exportInvestments() {
  try {
    const q = query(collection(db, 'investments'), orderBy('id', 'asc'));
    const snap = await getDocs(q);
    const items = snap.docs.map(d => {
      const data = d.data();
      return { id: data.id, name: data.name, image: data.image };
    });
    console.log(JSON.stringify(items, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

exportInvestments();
