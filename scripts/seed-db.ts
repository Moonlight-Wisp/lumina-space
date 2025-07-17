import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';

const DB_NAME = 'luminaspace';

const sampleProducts = [
  {
    title: 'Lampe Aurora RGB',
    description: 'Une lampe intelligente qui crée une ambiance unique avec des millions de couleurs.',
    price: 149.99,
    images: ['/images/Bestsellers/Lampe-Aurora-RGB.jpg'],
    category: 'Lampes',
    stock: 50,
    sellerName: 'Lumina Space',
    rating: 4.5,
    deliveryDelay: 3,
    deliveryInfo: 'Livraison gratuite en France métropolitaine',
    returnPolicy: 'Retour gratuit sous 30 jours'
  },
  {
    title: 'Cube Lumineux',
    description: 'Un cube décoratif qui diffuse une lumière douce et apaisante.',
    price: 79.99,
    images: ['/images/Bestsellers/Cube-Lumineux.jpg'],
    category: 'Lampes',
    stock: 30,
    sellerName: 'Lumina Space',
    rating: 4.2,
    deliveryDelay: 2,
    deliveryInfo: 'Livraison gratuite en France métropolitaine',
    returnPolicy: 'Retour gratuit sous 30 jours'
  },
  {
    title: 'Guirlande LED Smart',
    description: 'Une guirlande connectée pour créer une atmosphère festive.',
    price: 39.99,
    images: ['/images/Bestsellers/01-rope-light-shop-floating-desktop@2x.jpg'],
    category: 'Accessoires',
    stock: 100,
    sellerName: 'Lumina Space',
    rating: 4.7,
    deliveryDelay: 1,
    deliveryInfo: 'Livraison gratuite en France métropolitaine',
    returnPolicy: 'Retour gratuit sous 30 jours'
  }
];

async function verifyConnection() {
  if (mongoose.connection.readyState !== 1) {
    throw new Error('La connexion MongoDB n\'est pas établie');
  }
  
  if (mongoose.connection.name !== DB_NAME) {
    throw new Error(`Base de données incorrecte: ${mongoose.connection.name} (attendu: ${DB_NAME})`);
  }
}

async function seedDatabase() {
  try {
    console.log('🔄 Initialisation de la base de données...');
    
    // Établir la connexion
    await connectToDatabase();
    await verifyConnection();
    console.log('✅ Connexion à MongoDB établie');

  

    // Suppression des données existantes
    const deleteResult = await Product.deleteMany({});
    console.log(`🧹 ${deleteResult.deletedCount} produits existants supprimés`);

    // Insertion des nouvelles données
    const products = await Product.insertMany(sampleProducts);
    console.log(`✅ ${products.length} nouveaux produits insérés avec succès`);

    // Afficher les produits insérés
    console.log('\n📝 Produits insérés :');
    products.forEach((p, index) => {
      console.log(`${index + 1}. ${p.title} (ID: ${p._id})`);
      console.log(`   Prix: ${p.price}€ | Stock: ${p.stock} | Catégorie: ${p.category}`);
    });

    console.log('\n✨ Seeding terminé avec succès');
    return true;

  } catch (error) {
    console.error('\n❌ Erreur lors du seeding:', error instanceof Error ? error.message : 'Erreur inconnue');
    return false;
  } finally {
    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
        console.log('👋 Déconnexion propre de MongoDB');
      }
    } catch (disconnectError) {
      console.error('❌ Erreur lors de la déconnexion:', disconnectError);
    }
  }
}

// Gestion des erreurs non capturées
process.on('unhandledRejection', (error) => {
  console.error('🔥 Erreur non gérée:', error);
  process.exit(1);
});

// Exécution du script
seedDatabase()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('💥 Erreur fatale:', error);
    process.exit(1);
  });
