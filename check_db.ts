import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import config from './firebase-applet-config.json';

async function checkDatabase() {
  try {
    const app = initializeApp({
      projectId: config.projectId,
    });
    
    const db = getFirestore(app, config.firestoreDatabaseId);
    const docRef = db.collection('settings').doc('config');
    const doc = await docRef.get();
    
    if (doc.exists) {
      const data = doc.data();
      console.log("FIRESTORE_DATA_START");
      console.log(JSON.stringify(data, null, 2));
      console.log("FIRESTORE_DATA_END");
    } else {
      console.log("DOCUMENT_NOT_FOUND");
    }
  } catch (e) {
    console.error("Error checking database:", e);
  }
}

checkDatabase();
