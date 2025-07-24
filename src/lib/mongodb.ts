import mongoose from 'mongoose'
export async function connectToDatabase() {
  try {
    const DB_NAME = mongoose.connect(process.env.MONGODB_URI!,{
      dbName:"luminaspace"
    })

    console.log('✅ Connexion MongoDB établie sur la base:', DB_NAME);
    return "ok";

  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error);
    mongoose.connection.close().catch(console.error);
    throw error;
  }
}
