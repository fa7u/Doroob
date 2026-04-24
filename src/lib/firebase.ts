import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, setLogLevel } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Suppress noisy Firestore SDK logs (like quota exceeded backoff notices)
setLogLevel('error');

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Enable persistent local cache for offline support and instant loading
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
}, firebaseConfig.firestoreDatabaseId || '(default)');

export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

export interface FirestoreErrorInfo {
  error: string;
  operationType: 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';
  path: string | null;
  authInfo: {
    userId: string;
    email: string;
    emailVerified: boolean;
    isAnonymous: boolean;
    providerInfo: { providerId: string; displayName: string; email: string; }[];
  }
}

export const handleFirestoreError = (error: any, operationType: FirestoreErrorInfo['operationType'], path: string | null) => {
  const errorCode = error?.code || error?.name || 'unknown';
  const errorMessage = error?.message || (typeof error === 'string' ? error : 'Unknown error');
  const isQuota = errorCode === 'resource-exhausted' || errorMessage.includes('Quota limit exceeded');

  // Silence internal quota logs by returning early if we already know about it
  if (isQuota) {
    console.warn(`[Firestore Quota] ${operationType} paused for ${path || 'unknown path'}. Reached free tier limits.`);
  } else {
    console.error(`Firestore error during ${operationType} on ${path}:`, error);
  }
  
  // Specific handling for Quota Exceeded (resource-exhausted)
  if (isQuota) {
    const quotaMsg = "تنبيه: لقد وصلت للحصة المجانية لليوم من عمليات التعديل (Firebase Quota Exceeded). التعديلات الحالية قد لا تُحفظ في السحابة، ولكن تم تفعيل الحفظ المحلي في متصفحك لضمان بياناتك.";
    console.warn(quotaMsg);
    // Silent handling as requested to break 'security barriers' and 'preventing' messages
  }

  const authInfo = auth.currentUser ? {
    userId: auth.currentUser.uid,
    email: auth.currentUser.email || '',
    emailVerified: auth.currentUser.emailVerified,
    isAnonymous: auth.currentUser.isAnonymous,
    providerInfo: auth.currentUser.providerData.map(p => ({
      providerId: p.providerId,
      displayName: p.displayName || '',
      email: p.email || '',
    }))
  } : {
    userId: '',
    email: '',
    emailVerified: false,
    isAnonymous: true,
    providerInfo: []
  };

  throw JSON.stringify({
    error: errorMessage,
    code: errorCode,
    operationType,
    path,
    authInfo
  });
};
