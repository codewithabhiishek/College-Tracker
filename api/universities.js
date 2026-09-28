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
      const { rows } = await sql`SELECT * FROM universities WHERE user_id = ${userId} ORDER BY created_at ASC`;
      return res.status(200).json(rows);
    } catch (error) {
      console.error("GET /api/universities error:", error);
      return res.status(500).json({ error: "Failed to fetch universities" });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, country, program, deadline, status, portal_url, application_fee, fee_paid, notes } = req.body || {};
      if (!name || typeof name !== 'string') {
        return res.status(400).json({ error: "University name is required" });
      }
      const safeName = name.trim().slice(0, 200);
      const safeCountry = (country || '').trim().slice(0, 100);
      const safeProgram = (program || '').trim().slice(0, 200);
      const safeStatus = (status || 'researching').trim().slice(0, 50);
      const safeNotes = (notes || '').slice(0, 5000);

      const { rows } = await sql`
        INSERT INTO universities (user_id, name, country, program, deadline, status, portal_url, application_fee, fee_paid, notes)
        VALUES (${userId}, ${safeName}, ${safeCountry}, ${safeProgram}, ${deadline}, ${safeStatus}, ${portal_url}, ${application_fee}, ${fee_paid}, ${safeNotes})
        RETURNING *;
      `;
      return res.status(201).json(rows[0]);
    } catch (error) {
      console.error("POST /api/universities error:", error);
      return res.status(500).json({ error: "Failed to create university" });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { id, name, country, program, deadline, status, portal_url, application_fee, fee_paid, notes } = req.body || {};
      if (!id) return res.status(400).json({ error: "University ID is required" });
      const safeName = name ? name.trim().slice(0, 200) : name;
      const safeCountry = typeof country === 'string' ? country.trim().slice(0, 100) : country;
      const safeProgram = typeof program === 'string' ? program.trim().slice(0, 200) : program;
      const safeStatus = typeof status === 'string' ? status.trim().slice(0, 50) : status;
      const safeNotes = typeof notes === 'string' ? notes.slice(0, 5000) : notes;

      const { rows } = await sql`
        UPDATE universities
        SET name = ${safeName}, country = ${safeCountry}, program = ${safeProgram}, deadline = ${deadline}, status = ${safeStatus}, portal_url = ${portal_url}, application_fee = ${application_fee}, fee_paid = ${fee_paid}, notes = ${safeNotes}
        WHERE id = ${id} AND user_id = ${userId}
        RETURNING *;
      `;
      if (rows.length === 0) return res.status(404).json({ error: "Not found or not authorized" });
      return res.status(200).json(rows[0]);
    } catch (error) {
      console.error("PUT /api/universities error:", error);
      return res.status(500).json({ error: "Failed to update university" });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.body || {};
      if (!id) return res.status(400).json({ error: "University ID is required" });
      const { rows } = await sql`
        DELETE FROM universities
        WHERE id = ${id} AND user_id = ${userId}
        RETURNING *;
      `;
      if (rows.length === 0) return res.status(404).json({ error: "Not found or not authorized" });
      return res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
      console.error("DELETE /api/universities error:", error);
      return res.status(500).json({ error: "Failed to delete university" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
