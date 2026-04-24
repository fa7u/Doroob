
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import * as fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function dumpInvestments() {
  const querySnapshot = await getDocs(collection(db, 'investments'));
  const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  fs.writeFileSync('investments_dump.json', JSON.stringify(items, null, 2));
  console.log('Investments dumped to investments_dump.json');
  process.exit(0);
}

dumpInvestments();
