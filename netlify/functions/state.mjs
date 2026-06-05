import { getStore } from "@netlify/blobs";

// Sauvegarde partagée de l'application "Gestion des événements · Domaine Peraldi".
// GET  -> renvoie { ts, db }  (ts = horodatage de la dernière écriture, db = données)
// POST -> enregistre le corps comme nouveau "db", renvoie { ts }
export default async (req) => {
  const store = getStore({ name: "peraldi-events", consistency: "strong" });
  try {
    if (req.method === "GET") {
      const rec = await store.get("state", { type: "json" });
      return Response.json(rec || { ts: 0, db: null });
    }
    if (req.method === "POST") {
      const db = await req.json();
      const rec = { ts: Date.now(), db };
      await store.setJSON("state", rec);
      return Response.json({ ts: rec.ts });
    }
    return new Response("Méthode non autorisée", { status: 405 });
  } catch (e) {
    return new Response("Erreur serveur : " + (e && e.message ? e.message : e), { status: 500 });
  }
};
