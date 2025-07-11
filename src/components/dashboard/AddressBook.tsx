import { useEffect, useState } from 'react';
import axios from 'axios';
import { useUserStore } from '@/store/useUserStore';
import { Spinner, Button, Form, Card } from 'react-bootstrap';

type Address = {
  _id?: string;
  label: string;
  recipient: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
};

export default function AddressBook() {
  const { uid } = useUserStore();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Partial<Address>>({});
  const [editing, setEditing] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) return;
    axios.get(`/api/addresses?userId=${uid}`)
      .then(res => setAddresses(res.data))
      .finally(() => setLoading(false));
  }, [uid]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!uid) return;
    const data = { ...form, userId: uid };
    if (editing) {
      await axios.put('/api/addresses', { ...data, _id: editing });
    } else {
      await axios.post('/api/addresses', data);
    }
    const res = await axios.get(`/api/addresses?userId=${uid}`);
    setAddresses(res.data);
    setForm({});
    setEditing(null);
  };

  const handleEdit = (address: Address) => {
    setForm(address);
    setEditing(address._id!);
  };

  const handleDelete = async (id: string) => {
    await axios.delete('/api/addresses', { data: { id } });
    setAddresses(addresses.filter(a => a._id !== id));
    setForm({});
    setEditing(null);
  };

  const handleSetDefault = async (id: string) => {
    await axios.put('/api/addresses', { ...addresses.find(a => a._id === id), isDefault: true });
    const res = await axios.get(`/api/addresses?userId=${uid}`);
    setAddresses(res.data);
  };

  if (loading) return <Spinner animation="border" className="mt-4" />;

  return (
    <div className="mt-4">
      <h5>Mes adresses de livraison</h5>
      <Form onSubmit={handleSave} className="mb-4">
        <div className="row g-2">
          <div className="col-md-2"><Form.Control name="label" placeholder="Libellé (ex: Maison)" value={form.label||''} onChange={handleChange} required /></div>
          <div className="col-md-2"><Form.Control name="recipient" placeholder="Destinataire" value={form.recipient||''} onChange={handleChange} required /></div>
          <div className="col-md-2"><Form.Control name="street" placeholder="Adresse" value={form.street||''} onChange={handleChange} required /></div>
          <div className="col-md-2"><Form.Control name="city" placeholder="Ville" value={form.city||''} onChange={handleChange} required /></div>
          <div className="col-md-1"><Form.Control name="postalCode" placeholder="Code postal" value={form.postalCode||''} onChange={handleChange} required /></div>
          <div className="col-md-2"><Form.Control name="country" placeholder="Pays" value={form.country||''} onChange={handleChange} required /></div>
          <div className="col-md-1"><Form.Control name="phone" placeholder="Téléphone" value={form.phone||''} onChange={handleChange} /></div>
        </div>
        <div className="mt-2">
          <Button type="submit" variant="success">{editing ? 'Modifier' : 'Ajouter'}</Button>
          {editing && <Button variant="secondary" className="ms-2" onClick={()=>{setForm({});setEditing(null);}}>Annuler</Button>}
        </div>
      </Form>
      <div className="row">
        {addresses.map(address => (
          <div className="col-md-6 mb-3" key={address._id}>
            <Card className={address.isDefault ? 'border-success' : ''}>
              <Card.Body>
                <Card.Title>{address.label} {address.isDefault && <span className="badge bg-success ms-2">Par défaut</span>}</Card.Title>
                <Card.Text>
                  {address.recipient}<br/>
                  {address.street}, {address.city} {address.postalCode}<br/>
                  {address.country}<br/>
                  {address.phone && <>Tél: {address.phone}</>}
                </Card.Text>
                <Button size="sm" variant="outline-primary" onClick={()=>handleEdit(address)}>Modifier</Button>{' '}
                <Button size="sm" variant="outline-danger" onClick={()=>handleDelete(address._id!)}>Supprimer</Button>{' '}
                {!address.isDefault && <Button size="sm" variant="outline-success" onClick={()=>handleSetDefault(address._id!)}>Définir par défaut</Button>}
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
