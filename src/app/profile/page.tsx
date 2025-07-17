"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { Container, Spinner } from "react-bootstrap";
import axios from "axios";
import Image from "next/image";

interface Order {
  id: string | number;
  date: string;
  items: number;
  status: "Livrée" | "En cours" | "Annulée" | string;
}

interface UserProfile {
  fullName: string;
  email: string;
  phone?: string;
  lastLogin?: string;
  birthDate?: string;
  language?: string;
  currency?: string;
  address?: {
    street: string;
    city: string;
    country: string;
    zip: string;
  };
  orders?: Order[];
  payments?: {
    card: string;
    expiry: string;
    secondary?: string;
  };
  rewards?: {
    points: number;
    vouchers: number;
  };
  security?: {
    passwordUpdated: string;
    twoFA: boolean;
  };
}

export default function ProfileClient() {
  const { uid } = useUserStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/api/user/${uid}`);
        setProfile(res.data);
      } catch (err) {
        console.error("Erreur lors de la récupération du profil:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [uid]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (!profile) {
    return <Container className="py-5 text-center">Profil introuvable.</Container>;
  }

  return (
    <Container className="py-5">
      <div className="bg-white dark:bg-black glass-bg rounded-4 p-4 mb-4 shadow">
        <div className="d-flex align-items-center gap-4">
          <Image
            src="/images/Temoignages/35dd54ce9da554d665eb0979b0d7febd.jpg"
            alt="Avatar"
            className="rounded-circle border border-info"
            width={100}
            height={100}
          />
          <div>
            <h2 className="fw-bold mb-1">{profile.fullName}</h2>
            <p className="mb-0 text-muted small">
              {profile.email} {profile.phone && `| ${profile.phone}`}
            </p>
            {profile.lastLogin && (
              <p className="mb-0 text-muted small">Dernière connexion : {profile.lastLogin}</p>
            )}
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="glass-bg rounded-4 p-4 shadow">
            <h5 className="mb-3">📇 Informations personnelles</h5>
            <p>
              <strong>Date de naissance :</strong> {profile.birthDate || "-"}
            </p>
            <p>
              <strong>Langue :</strong> {profile.language || "Français"}
            </p>
            <p>
              <strong>Devise :</strong> {profile.currency || "XOF"}
            </p>
          </div>
        </div>

        <div className="col-md-6">
          <div className="glass-bg rounded-4 p-4 shadow">
            <h5 className="mb-3">📦 Adresse principale</h5>
            {profile.address ? (
              <>
                <p>{profile.address.street}</p>
                <p>
                  {profile.address.city}, {profile.address.country}
                </p>
                <p>Code postal : {profile.address.zip}</p>
              </>
            ) : (
              <p className="text-muted">Aucune adresse renseignée</p>
            )}
          </div>
        </div>

        <div className="col-md-6">
          <div className="glass-bg rounded-4 p-4 shadow">
            <h5 className="mb-3">🛒 Commandes récentes</h5>
            {profile.orders?.length ? (
              <ul className="list-unstyled mb-0">
                {profile.orders.slice(0, 3).map((order, i) => (
                  <li key={i} className="mb-2">
                    Commande #{order.id} - {order.date} - {order.items} article(s) -{" "}
                    <span
                      className={`fw-semibold text-${
                        order.status === "Livrée" ? "success" : "warning"
                      }`}
                    >
                      {order.status}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">Aucune commande</p>
            )}
          </div>
        </div>

        <div className="col-md-6">
          <div className="glass-bg rounded-4 p-4 shadow">
            <h5 className="mb-3">💳 Paiements</h5>
            <p>Carte : **** **** **** {profile.payments?.card || "0000"}</p>
            <p>Expire : {profile.payments?.expiry || "--/--"}</p>
            {profile.payments?.secondary && <p>Méthode secondaire : {profile.payments.secondary}</p>}
          </div>
        </div>

        <div className="col-md-6">
          <div className="glass-bg rounded-4 p-4 shadow">
            <h5 className="mb-3">🎁 Récompenses</h5>
            <p>
              Points fidélité :{" "}
              <span className="text-info fw-bold">{profile.rewards?.points ?? 0}</span>
            </p>
            <p>Bons actifs : {profile.rewards?.vouchers ?? 0}</p>
          </div>
        </div>

        <div className="col-md-6">
          <div className="glass-bg rounded-4 p-4 shadow">
            <h5 className="mb-3">🔐 Sécurité</h5>
            <p>Mot de passe modifié le : {profile.security?.passwordUpdated || "-"}</p>
            <p>
              2FA :{" "}
              <span
                className={`fw-bold text-${profile.security?.twoFA ? "success" : "danger"}`}
              >
                {profile.security?.twoFA ? "Activée" : "Désactivée"}
              </span>
            </p>
          </div>
        </div>
      </div>

      <p className="text-center text-muted small mt-5">
        © {new Date().getFullYear()} Lumina Space - Tous droits réservés
      </p>
    </Container>
  );
}
