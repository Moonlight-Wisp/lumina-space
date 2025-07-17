import { useEffect, useState } from 'react';
import axios from 'axios';
import { useUserStore } from '@/store/useUserStore';
import { Product } from '@/types/product';
import { Spinner, Button, Card } from 'react-bootstrap';

export default function Wishlist() {
  const { uid } = useUserStore();
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      setProducts([]);
      return;
    }
    const fetchWishlist = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/wishlist?userId=${uid}`);
        setWishlist(data.productIds || []);
        if (data.productIds && data.productIds.length > 0) {
          const res = await axios.get('/api/products');
          setProducts(res.data.filter((p: Product) => data.productIds.includes(p.id)));
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Erreur lors du chargement de la wishlist", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [uid]);

  const handleRemove = async (productId: string) => {
    if (!uid) {
      toast.error("Veuillez vous connecter pour modifier la wishlist.");
      return;
    }
    try {
      await axios.delete('/api/wishlist', { data: { userId: uid, productId } });
      setWishlist(wishlist.filter(id => id !== productId));
      setProducts(products.filter(p => p.id !== productId));
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  if (!uid) return <div className="mt-4 text-danger">Veuillez vous connecter pour voir votre wishlist.</div>;

  if (loading) return <Spinner animation="border" className="mt-4" />;

  if (!products.length) return <div className="mt-4">Votre wishlist est vide.</div>;

  return (
    <div className="mt-4">
      <h5>Ma liste de souhaits</h5>
      <div className="row">
        {products.map(product => (
          <div className="col-md-4 mb-3" key={product.id}>
            <Card className="glass-bg h-100 border-0 text-center p-3">
              <Card.Img variant="top" src={product.images?.[0]} style={{ objectFit: 'cover', height: 180 }} />
              <Card.Body>
                <Card.Title>{product.title}</Card.Title>
                <Card.Text>{product.price} €</Card.Text>
                <Button variant="outline-danger" onClick={() => handleRemove(product.id)}>
                  Retirer
                </Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
