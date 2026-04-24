
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function dumpInvestments() {
  const investCol = collection(db, 'investments');
  const snapshot = await getDocs(investCol);
  const data = snapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }));

  fs.writeFileSync('firestore_dump.json', JSON.stringify(data, null, 2));
  console.log(`Dumped ${data.length} documents. IDs:`, data.map(d => d.docId).join(', '));
}

dumpInvestments().catch(console.error);
