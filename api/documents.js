import { sql } from '@vercel/postgres';
import { verifyToken } from '@clerk/backend';

export default async function handler(req, res) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: "Unauthorized - No token provided" });
  }

  let userId;
  try {
    const payload = await verifyToken(token, { 
      secretKey: process.env.CLERK_SECRET_KEY 
    });
    userId = payload.sub;
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ error: "Unauthorized - Invalid token" });
  }

  if (req.method === 'GET') {
    try {
      const { rows } = await sql`SELECT * FROM global_documents WHERE user_id = ${userId} ORDER BY created_at ASC`;
      return res.status(200).json(rows);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const { doc_name, is_ready } = req.body;
      const { rows } = await sql`
        INSERT INTO global_documents (user_id, doc_name, is_ready)
        VALUES (${userId}, ${doc_name}, ${is_ready})
        RETURNING *;
      `;
      return res.status(201).json(rows[0]);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { id, is_ready } = req.body;
      const { rows } = await sql`
        UPDATE global_documents
        SET is_ready = ${is_ready}
        WHERE id = ${id} AND user_id = ${userId}
        RETURNING *;
      `;
      if (rows.length === 0) return res.status(404).json({ error: "Not found or not authorized" });
      return res.status(200).json(rows[0]);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.body;
      const { rows } = await sql`
        DELETE FROM global_documents
        WHERE id = ${id} AND user_id = ${userId}
        RETURNING *;
      `;
      if (rows.length === 0) return res.status(404).json({ error: "Not found or not authorized" });
      return res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
