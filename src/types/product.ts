export interface Product {
  _id: string;
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


export interface ProductReview {
  _id: string;          
  productId: string;    
  userId: string;       
  userName: string;     
  rating: number;       
  comment: string;      
  createdAt: Date;      
  updatedAt?: Date;     
}
