import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, orderBy, query } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json';

async function listInvestments() {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
  const investCol = collection(db, 'investments');
  const snap = await getDocs(query(investCol, orderBy('id', 'asc')));
  
  console.log(`Total investments in DB: ${snap.size}`);
  snap.forEach(doc => {
    const data = doc.data();
    console.log(`ID: ${data.id}, Name: ${data.name}`);
  });
}

listInvestments();
