import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Order from '@/models/Order';
import Product from '@/models/Product';
import Notification from '@/models/Notification';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  await connectToDatabase();
  const userId = req.nextUrl.searchParams.get('userId');
  const sellerId = req.nextUrl.searchParams.get('sellerId');

  let orders;
  if (userId) {
    orders = await Order.find({ userId }).sort({ createdAt: -1 });
  } else if (sellerId) {
    // Récupérer toutes les commandes contenant des produits du vendeur
    orders = await Order.find({ 'items.sellerId': sellerId }).sort({ createdAt: -1 });
  } else {
    orders = await Order.find().sort({ createdAt: -1 });
  }
  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const body = await req.json();
  const order = new Order({ ...body });
  await order.save();

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
  return NextResponse.json(order, { status: 201 });
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
