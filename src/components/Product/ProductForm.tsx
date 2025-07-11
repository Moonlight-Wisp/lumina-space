"use client";
import { useState } from 'react';
import { Product } from '@/types/product';

interface ProductFormProps {
  onSaveAction: (product: Partial<Product>) => void;
  initial?: Partial<Product>;
}

export default function ProductForm({ onSaveAction, initial }: ProductFormProps) {
  const [form, setForm] = useState<Partial<Product>>(initial || {});
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "price" || name === "stock") {
      setForm({ ...form, [name]: value === "" ? "" : Number(value) });
    } else if (name === "images") {
      setForm({ ...form, images: [value] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveAction(form);
  };
  return (
    <form onSubmit={handleSubmit} className="p-3 bg-light rounded shadow-sm">
      <div className="mb-3">
        <label className="form-label">Nom du produit</label>
        <input
          name="title"
          className="form-control"
          value={form.title || ''}
          onChange={handleChange}
          required
          placeholder="Entrez le nom du produit"
          title="Nom du produit"
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          name="description"
          className="form-control"
          value={form.description || ''}
          onChange={handleChange}
          required
          placeholder="Entrez la description du produit"
          title="Description du produit"
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Prix (€)</label>
        <input
          name="price"
          type="number"
          className="form-control"
          value={form.price || ''}
          onChange={handleChange}
          required
          placeholder="Entrez le prix"
          title="Prix du produit"
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Catégorie</label>
        <input
          name="category"
          className="form-control"
          value={form.category || ''}
          onChange={handleChange}
          required
          placeholder="Entrez la catégorie"
          title="Catégorie du produit"
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Stock</label>
        <input
          name="stock"
          type="number"
          className="form-control"
          value={form.stock || ''}
          onChange={handleChange}
          required
          placeholder="Entrez le stock"
          title="Stock du produit"
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Image principale (URL)</label>
        <input
          name="images"
          className="form-control"
          value={form.images?.[0] || ''}
          onChange={e => setForm({ ...form, images: [e.target.value] })}
          required
          placeholder="Entrez l'URL de l'image principale"
          title="Image principale (URL)"
        />
      </div>
      <button className="btn btn-accent" type="submit">Enregistrer</button>
    </form>
  );
}
