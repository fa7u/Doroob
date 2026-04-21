import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import config from './firebase-applet-config.json';

// In AI Studio/Google Cloud environment, we can often initialize without explicit cert if running in a trusted context
// or we can just try to update the document.
async function repair() {
  try {
    const app = initializeApp({
      projectId: config.projectId,
    });
    
    const db = getFirestore(app, config.firestoreDatabaseId);
    const docRef = db.collection('settings').doc('config');
    
    const doc = await docRef.get();
    let data = doc.exists ? doc.data() : {};
    
    if (data) {
        if (!data.join) data.join = {};
        data.join.url = "https://tally.so/r/2ExyJp";
        data.updatedAt = new Date().toISOString();
        
        await docRef.set(data, { merge: true });
        console.log("SUCCESS: Database updated successfully with the new URL!");
    }
  } catch (e) {
    console.error("FAILED to update database via Admin SDK:", e);
    process.exit(1);
  }
}

repair();
