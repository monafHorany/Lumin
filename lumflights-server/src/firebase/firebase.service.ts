import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  public db: admin.firestore.Firestore;

  async onModuleInit() {
    const module = await import(
      './luminai-b9a58-firebase-adminsdk-fbsvc-04866ca35f.json'
    );
    const serviceAccount = module.default as admin.ServiceAccount;

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    this.db = admin.firestore();
  }

  getDatabase() {
    if (!this.db) {
      console.error('❌ Firestore database is undefined.');
    }
    return this.db;
  }

  async addDocument(collection: string, data: Record<string, any>) {
    const docRef = await this.db.collection(collection).add(data);
    return { id: docRef.id };
  }

  async getDocument(collection: string, docId: string) {
    const doc = await this.db.collection(collection).doc(docId).get();
    if (!doc.exists) {
      throw new Error('Document not found');
    }
    return doc.data();
  }

  async updateDocument(
    collection: string,
    docId: string,
    data: Record<string, any>,
  ) {
    await this.db.collection(collection).doc(docId).update(data);
    return { message: 'Document updated successfully' };
  }

  async deleteDocument(collection: string, docId: string) {
    await this.db.collection(collection).doc(docId).delete();
    return { message: 'Document deleted successfully' };
  }

  // ✅ **New Method: Paginate a Collection**
  async paginateCollection(
    collection: string,
    pageSize: number,
    lastDocId?: string,
  ) {
    let query = this.db.collection(collection).orderBy('created_at').limit(pageSize);

    // Use last document ID as cursor for pagination
    if (lastDocId) {
      const lastDocRef = await this.db.collection(collection).doc(lastDocId).get();
      if (lastDocRef.exists) {
        query = query.startAfter(lastDocRef);
      } else {
        throw new Error('Invalid last document ID');
      }
    }

    const snapshot = await query.get();
    const documents = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        created_at: data.created_at ? data.created_at.toDate() : null, // ✅ Convert Firestore Timestamp
      };
    });

    return {
      data: documents,
      lastDocId: snapshot.docs.length ? snapshot.docs[snapshot.docs.length - 1].id : null,
    };
  }
}
