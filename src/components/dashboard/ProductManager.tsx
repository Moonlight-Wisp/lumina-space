'use client';

import { useState, useEffect } from 'react';
import { Button, Form, Table, Modal } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import axios from 'axios';

interface Product {
  _id: string;
  title: string;
  price: number;
  stock: number;
  category: string;
}

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    price: 0,
    stock: 0,
    category: ''
  });

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data.data || []);
    } catch (error) {
      toast.error('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedProduct) {
        await axios.put(`/api/products/${selectedProduct._id}`, formData);
        toast.success('Produit mis à jour avec succès');
      } else {
        await axios.post('/api/products', formData);
        toast.success('Produit ajouté avec succès');
      }
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement du produit');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await axios.delete(`/api/products/${id}`);
        toast.success('Produit supprimé avec succès');
        fetchProducts();
      } catch (error) {
        toast.error('Erreur lors de la suppression du produit');
      }
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Gestion des Produits</h1>
      
      <Button 
        variant="primary" 
        className="mb-3"
        onClick={() => {
          setSelectedProduct(null);
          setFormData({ title: '', price: 0, stock: 0, category: '' });
          setShowModal(true);
        }}
      >
        Ajouter un produit
      </Button>

      {loading ? (
        <div>Chargement...</div>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Titre</th>
              <th>Prix</th>
              <th>Stock</th>
              <th>Catégorie</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.title}</td>
                <td>{product.price}€</td>
                <td>{product.stock}</td>
                <td>{product.category}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => {
                      setSelectedProduct(product);
                      setFormData(product);
                      setShowModal(true);
                    }}
                  >
                    Modifier
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(product._id)}
                  >
                    Supprimer
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedProduct ? 'Modifier le produit' : 'Ajouter un produit'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Titre</Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Prix</Form.Label>
              <Form.Control
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Catégorie</Form.Label>
              <Form.Control
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              {selectedProduct ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
