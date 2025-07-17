import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'luminaspace';

async function checkAndCreateDatabase() {
  const client = await MongoClient.connect(MONGODB_URI);
  try {
    console.log('🔍 Vérification de l\'existence de la base de données...');
    
    // Liste toutes les bases de données
    const adminDb = client.db('admin');
    const dbs = await adminDb.admin().listDatabases();
    
    // Vérifie si notre base existe
    const dbExists = dbs.databases.some(db => db.name === DB_NAME);
    
    if (!dbExists) {
      console.log(`📦 Création de la base de données ${DB_NAME}...`);
      // Pour créer une base de données dans MongoDB, il faut créer au moins une collection
      const db = client.db(DB_NAME);
      await db.createCollection('test_collection');
      console.log(`✅ Base de données ${DB_NAME} créée avec succès`);
    } else {
      console.log(`✅ La base de données ${DB_NAME} existe déjà`);
    }
  } finally {
    await client.close();
  }
}

async function connectToDatabase() {
  try {
    // D'abord, on vérifie/crée la base de données
    await checkAndCreateDatabase();
    
    console.log('🔄 Connexion à la base de données...');
    
    // Connexion avec mongoose
    if (mongoose.connection.readyState >= 1) {
      console.log('✅ Réutilisation de la connexion existante');
      return mongoose.connection;
    }

    const connection = await mongoose.connect(`${MONGODB_URI}/${DB_NAME}`, {
      bufferCommands: false,
      dbName: DB_NAME,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ Nouvelle connexion établie à ${DB_NAME}`);
    return connection;
  } catch (error) {
    console.error('❌ Erreur de connexion:', error);
    throw error;
  }
}

export async function GET() {
  try {
    console.log('� Initialisation de la base de données...');
    const connection = await connectToDatabase();
    console.log('✅ Connexion MongoDB établie sur la base:', DB_NAME);

    const client = mongoose.connection.getClient();
    const db = client.db('luminaspace');

    // Créer une collection de test
    try {
      await db.createCollection('test_collection');
      console.log('✅ Collection de test créée');
    } catch (err: any) {
      if (err.codeName === 'NamespaceExists') {
        console.log('ℹ️ Collection de test déjà existante');
      } else {
        throw err;
      }
    }

    // Lister les collections
    const collectionsCursor = db.listCollections();
    const collections: string[] = [];
    for await (const coll of collectionsCursor) {
      collections.push(coll.name);
    }
    console.log(`📊 Collections disponibles: ${collections.join(', ')}`);

    return new Response(JSON.stringify({ collections }), { status: 200 });
  } catch (err) {
    console.error('❌ Erreur MongoDB :', err);
    return new Response('Erreur serveur MongoDB', { status: 500 });
  } finally {
    try {
      await mongoose.disconnect();
      console.log('👋 Déconnexion de MongoDB');
    } catch (err) {
      console.error('❌ Erreur déconnexion MongoDB:', err);
    }
  }
}
