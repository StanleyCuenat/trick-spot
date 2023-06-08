import * as admin from 'firebase-admin';
export interface FirebaseAdmin {
    firestore: admin.firestore.Firestore;
    storage: admin.storage.Storage;
    auth: admin.auth.Auth;
}
