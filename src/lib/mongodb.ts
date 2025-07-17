import mongoose from 'mongoose';

// Déclaration des types globaux
declare global {
  var mongoose: {
    conn: Promise<typeof mongoose> | null;
    promise: Promise<typeof mongoose> | null;
  };
}

// Configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/luminaspace';
const DB_NAME = 'luminaspace';

// Initialisation du cache global
if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  try {
    // Réutiliser une connexion existante si disponible
    if (mongoose.connection.readyState === 1) {
      if (mongoose.connection.name !== DB_NAME) {
        await mongoose.connection.useDb(DB_NAME);
      }
      return mongoose;
    }

    // Configurer une nouvelle connexion
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      dbName: DB_NAME
    };

    // Établir la connexion
    mongoose.set('strictQuery', false);
    await mongoose.connect(MONGODB_URI, opts);

    // Vérifier que la connexion est établie


    console.log('✅ Connexion MongoDB établie sur la base:', DB_NAME);
    return mongoose;

  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error);
    mongoose.connection.close().catch(console.error);
    throw error;
  }
}
