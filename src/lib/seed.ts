import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';

const testProducts = [
  {
    name: "Lampe Aurora RGB",
    description: "Une lampe connectée avec des effets lumineux RGB personnalisables",
    price: 79.99,
    images: ["/images/Bestsellers/Lampe-Aurora-RGB.jpg"],
    category: "Lampes",
    stock: 50,
    sellerId: "vendor123",
    rating: 4.5,
  },
  {
    name: "Cube Lumineux",
    description: "Cube décoratif lumineux intelligent",
    price: 49.99,
    images: ["/images/Bestsellers/Cube-Lumineux.jpg"],
    category: "Décorations",
    stock: 30,
    sellerId: "vendor123",
    rating: 4.8,
  },
  {
    name: "Guirlande LED Smart",
    description: "Guirlande LED connectée pour l'extérieur",
    price: 39.99,
    images: ["/images/Bestsellers/01-rope-light-shop-floating-desktop@2x.jpg"],
    category: "Extérieur",
    stock: 100,
    sellerId: "vendor123",
    rating: 4.7,
  }
];

export async function seedProducts() {
  try {
    await connectToDatabase();
    
    // Supprime les produits existants
    await Product.deleteMany({});
    
    // Insère les nouveaux produits
    await Product.insertMany(testProducts);
    
    console.log('Base de données initialisée avec succès !');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
  }
}
