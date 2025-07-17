import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import mongoose from 'mongoose';
import { CollectionInfo } from 'mongodb';

export async function GET() {
  try {
    await connectToDatabase();

    // Vérifier l'état de la connexion
    const isConnected = mongoose.connection.readyState === 1;

    if (!isConnected) {
      throw new Error('La connexion MongoDB n\'est pas établie');
    }

    const db = mongoose.connection.getClient().db('luminaspace'); // ✅ utilise getClient().db() (plus fiable que useDb)

    // Tenter de créer une collection de test
    try {
      await db.createCollection('test_collection');
      console.log('✅ Collection test créée');
    } catch (e: any) {
      if (e.codeName === 'NamespaceExists') {
        console.log('ℹ️ Collection test déjà existante');
      } else {
        throw e;
      }
    }

    // Liste des collections (AsyncIterator compatible MongoDB v5+)
    const collectionsCursor = db.listCollections();
    const collections: CollectionInfo[] = [];
    for await (const col of collectionsCursor) {
      collections.push(col);
    }

    return NextResponse.json({
      status: 'success',
      message: 'Connecté à MongoDB',
      connectionStatus: {
        isConnected,
        host: mongoose.connection.host,
        dbName: db.databaseName,
      },
      collections: collections.map(col => col.name),
    });
  } catch (error) {
    console.error('❌ Erreur MongoDB:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Erreur de connexion à MongoDB',
        error: error instanceof Error ? error.message : String(error),
        connectionStatus: {
          isConnected: mongoose.connection.readyState === 1,
          host: mongoose.connection.host,
          dbName: mongoose.connection.name,
        },
      },
      { status: 500 }
    );
  }
}
