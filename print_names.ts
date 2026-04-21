import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import * as fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function checkNames() {
  const docRef = doc(db, 'settings', 'config');
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    console.log('--- ALL MEMBERS ---');
    data.team.members.forEach((m: any) => {
      console.log(`${m.id}: ${m.name} - ${m.bio}`);
    });
    console.log('--- END ---');
  } else {
    console.log('No such document!');
  }
}

checkNames().catch(console.error);
