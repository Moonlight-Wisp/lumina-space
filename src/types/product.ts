export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[]; 
  category: string;
  stock: number;
  sellerName: string;
  rating: number;
  deliveryDelay: number;
  deliveryInfo: string;
  returnPolicy: string;
  createdAt: Date;
  updatedAt?: Date;
}
