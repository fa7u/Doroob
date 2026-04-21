import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import config from './firebase-applet-config.json' with { type: "json" };

async function checkData() {
  try {
    const firebaseConfig = {
      apiKey: config.apiKey,
      authDomain: config.authDomain,
      projectId: config.projectId,
      storageBucket: config.storageBucket,
      messagingSenderId: config.messagingSenderId,
      appId: config.appId
    };
    
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app, config.firestoreDatabaseId);
    
    console.log("Fetching settings/config...");
    const snap = await getDoc(doc(db, 'settings', 'config'));
    
    if (snap.exists()) {
      const data = snap.data();
      console.log("FIRESTORE_DATA:");
      console.log(JSON.stringify(data, null, 2));
    } else {
      console.log("Document settings/config does not exist in Firestore.");
    }
  } catch (e) {
    console.error("Error during check:", e);
  }
}

checkData();
