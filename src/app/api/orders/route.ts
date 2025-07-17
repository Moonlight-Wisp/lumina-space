import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Order from '@/models/Order';
import Product from '@/models/Product';
import Notification from '@/models/Notification';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  try {
    console.log('Récupération des commandes...');
    await connectToDatabase();
    const userId = req.nextUrl.searchParams.get('userId');
    const sellerId = req.nextUrl.searchParams.get('sellerId');

    console.log('Paramètres de recherche:', { userId, sellerId });

    let orders;
    if (userId) {
      orders = await Order.find({ userId }).sort({ createdAt: -1 });
      console.log(`Commandes trouvées pour l'utilisateur ${userId}:`, orders.length);
    } else if (sellerId) {
      orders = await Order.find({ 'items.sellerId': sellerId }).sort({ createdAt: -1 });
      console.log(`Commandes trouvées pour le vendeur ${sellerId}:`, orders.length);
    } else {
      orders = await Order.find().sort({ createdAt: -1 });
      console.log('Toutes les commandes:', orders.length);
    }

    if (!orders || orders.length === 0) {
      console.log('Aucune commande trouvée');
      return NextResponse.json([]);
    }

    // Enrichir les commandes avec les informations des produits
    const enrichedOrders = await Promise.all(orders.map(async (order) => {
      const orderObj = order.toObject();
      
      // Récupérer les détails des produits pour chaque item
      const enrichedItems = await Promise.all(orderObj.items.map(async (item) => {
        try {
          const product = await Product.findById(item.productId);
          return {
            ...item,
            title: product?.title || 'Produit non trouvé',
            image: product?.images?.[0] || null
          };
        } catch (err) {
          console.error(`Erreur lors de la récupération du produit ${item.productId}:`, err);
          return item;
        }
      }));

      return {
        ...orderObj,
        items: enrichedItems
      };
    }));

    console.log('Commandes enrichies renvoyées avec succès');
    return NextResponse.json(enrichedOrders);
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des commandes' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log('Début de la création de commande');
    await connectToDatabase();
    const body = await req.json();
    
    // Validation des données requises
    if (!body.userId || !body.items || !body.items.length || !body.shippingAddress) {
      console.error('Données manquantes:', { body });
      return NextResponse.json({ 
        error: 'Données invalides: userId, items et shippingAddress sont requis' 
      }, { status: 400 });
    }

    // Validation de l'adresse
    const { street, city, postalCode, country } = body.shippingAddress;
    if (!street || !city || !postalCode || !country) {
      console.error('Adresse invalide:', body.shippingAddress);
      return NextResponse.json({ 
        error: 'Adresse de livraison invalide' 
      }, { status: 400 });
    }

    // Calcul du montant total
    let totalAmount = 0;
    for (const item of body.items) {
      if (!item.productId || !item.quantity || !item.price) {
        console.error('Item invalide:', item);
        return NextResponse.json({ 
          error: 'Données d\'article invalides' 
        }, { status: 400 });
      }
      totalAmount += item.quantity * item.price;
    }

    const orderData = {
      ...body,
      totalAmount,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('Création de la commande avec les données:', orderData);
    const order = new Order(orderData);
    await order.save();
    console.log('Commande créée avec succès:', order._id);

    // Génération notifications vendeurs
    try {
    // Récupérer tous les produits commandés (pour retrouver les vendeurs)
    const productIds = order.items.map((item: { productId: string }) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });
    // Regrouper par vendeur
    const sellerMap: Record<string, { sellerName: string; productTitles: string[] }> = {};
    products.forEach((prod: { sellerName: string; title: string }) => {
      // On suppose que le champ sellerName = uid du vendeur (sinon adapter ici)
      if (!sellerMap[prod.sellerName]) {
        sellerMap[prod.sellerName] = { sellerName: prod.sellerName, productTitles: [] };
      }
      sellerMap[prod.sellerName].productTitles.push(prod.title);
    });
    // Créer une notification pour chaque vendeur
    const notifications = Object.entries(sellerMap).map(([sellerUid, { productTitles }]) => {
      return {
        userId: sellerUid,
        type: 'order',
        message: `Nouvelle commande reçue pour : ${productTitles.join(', ')}`,
        link: `/dashboard/vendeur?order=${order._id}`,
        read: false,
        createdAt: new Date(),
      };
    });
    if (notifications.length) {
      await Notification.insertMany(notifications);
    }
  } catch (e) {
    // Ne bloque pas la création de commande si la notif échoue
    console.error('Erreur notification vendeur:', e);
  }

  // Retourner la commande créée
  return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error);
    return NextResponse.json({ 
      error: 'Erreur lors de la création de la commande' 
    }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  await connectToDatabase();
  const body = await req.json();
  // On récupère l'ancienne commande pour détecter un changement de statut
  const oldOrder = await Order.findById(body._id);
  const order = await Order.findByIdAndUpdate(body._id, { ...body, updatedAt: new Date() }, { new: true });
  if (!order) return NextResponse.json({ error: 'Commande non trouvée' }, { status: 404 });

  // Générer une notification si le statut a changé
  if (oldOrder && body.status && oldOrder.status !== body.status) {
    let notifMsg = '';
    switch (body.status) {
      case 'processing':
        notifMsg = "Votre commande est en cours de traitement.";
        break;
      case 'shipped':
        notifMsg = "Votre commande a été expédiée !";
        break;
      case 'delivered':
        notifMsg = "Votre commande a été livrée.";
        break;
      case 'cancelled':
        notifMsg = "Votre commande a été annulée.";
        break;
      default:
        notifMsg = `Statut de commande mis à jour : ${body.status}`;
    }
    await Notification.create({
      userId: order.userId,
      type: 'order-status',
      message: notifMsg,
      link: `/dashboard/client?order=${order._id}`,
      read: false,
      createdAt: new Date(),
    });
  }
  return NextResponse.json(order);
}

export async function DELETE(req: NextRequest) {
  await connectToDatabase();
  const { id } = await req.json();
  await Order.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
