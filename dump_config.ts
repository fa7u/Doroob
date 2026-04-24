
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function dumpConfig() {
  const configRef = doc(db, 'settings', 'config');
  const snapshot = await getDoc(configRef);
  if (snapshot.exists()) {
    fs.writeFileSync('config_dump.json', JSON.stringify(snapshot.data(), null, 2));
    console.log("Dumped settings/config document.");
  } else {
    console.log("settings/config document does not exist.");
  }
}

dumpConfig().catch(console.error);
