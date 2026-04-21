import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import config from './firebase-applet-config.json';

async function listCollections() {
  try {
    const app = initializeApp({
      projectId: config.projectId,
    });
    
    const db = getFirestore(app, config.firestoreDatabaseId);
    const collections = await db.listCollections();
    
    console.log("COLLECTIONS_START");
    for (const col of collections) {
      console.log(`Collection: ${col.id}`);
      const docs = await col.get();
      docs.forEach(doc => {
        console.log(`  Document: ${doc.id}`);
        console.log(JSON.stringify(doc.data(), null, 2));
      });
    }
    console.log("COLLECTIONS_END");
  } catch (e) {
    console.error("Error listing collections:", e);
  }
}

listCollections();
