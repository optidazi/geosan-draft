// Paste your Firebase web app config here (Firebase console → Project settings → Your apps).
// These values are not secret: access is controlled by firestore.rules.
export const firebaseConfig = {
  apiKey: "PASTE_API_KEY",
  authDomain: "PASTE_PROJECT_ID.firebaseapp.com",
  projectId: "PASTE_PROJECT_ID",
  storageBucket: "PASTE_PROJECT_ID.appspot.com",
  messagingSenderId: "PASTE_SENDER_ID",
  appId: "PASTE_APP_ID",
};

// User UID of the admin account (Firebase console → Authentication → Users).
// Must match the UID in firestore.rules.
export const ADMIN_UID = "PASTE_ADMIN_UID";
