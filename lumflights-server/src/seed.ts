import * as admin from 'firebase-admin';
async function seedFirestore() {
  let db: admin.firestore.Firestore;
  const module = await import(
    './firebase/luminai-b9a58-firebase-adminsdk-fbsvc-04866ca35f.json'
  );
  const serviceAccount = module.default as admin.ServiceAccount;

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  db = admin.firestore();

  if (!db) {
    console.error('Firestore database is undefined.');
    return;
  }

  const reservationsCollection = db.collection('reservations');
  const generateRandomCustomer = () => ({
    name: `Customer_${Math.floor(Math.random() * 1000)}`,
    age: Math.floor(Math.random() * 60) + 18,
    email: `customer${Math.floor(Math.random() * 1000)}@example.com`,
  });
  for (let i = 0; i < 1000; i++) {
    const numCustomers = Math.floor(Math.random() * 3) + 1; // 1 to 3 customers per reservation
    const customers = Array.from(
      { length: numCustomers },
      generateRandomCustomer,
    );
    const reservation = {
      reservation_id: `res_${i}`,
      flight_number: `FL${Math.floor(Math.random() * 900) + 100}`,
      customers: customers,
      created_at: new Date(),
    };

    await reservationsCollection
      .doc(reservation.reservation_id)
      .set(reservation);
    console.log(`Inserted reservation ${i + 1}/1000`);
  }

  console.log('✅ Seeding completed.');
}

seedFirestore().catch(console.error);
