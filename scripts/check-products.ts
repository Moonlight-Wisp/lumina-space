import mongoose from 'mongoose';
import { config } from 'dotenv';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';

// Charger les variables d'environnement
config({ path: '.env.local' });

async function checkProducts() {
  try {
    console.log('🔄 Connexion à la base de données...');
    console.log('URI MongoDB:', process.env.MONGODB_URI);
    await connectToDatabase();
    console.log('✅ Connexion établie avec succès');
    
    // Récupérer tous les produits
    const products = await Product.find({});
    
    if (products.length === 0) {
      console.log('❌ Aucun produit trouvé dans la base de données');
      return;
    }

    console.log(`✅ ${products.length} produits trouvés dans la base de données :\n`);
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.title}`);
      console.log(`   Description: ${product.description}`);
      console.log(`   Prix: ${product.price}€`);
      console.log(`   Catégorie: ${product.category}`);
      console.log(`   Stock: ${product.stock}`);
      console.log(`   Images: ${product.images.join(', ')}`);
      console.log('   -------------------------');
    });

  } catch (error) {
    console.error('❌ Erreur:', error instanceof Error ? error.message : 'Erreur inconnue');
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Déconnexion de la base de données');
  }
}

checkProducts();
