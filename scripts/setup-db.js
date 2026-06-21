import { sql } from '@vercel/postgres';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Load .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function createTables() {
  try {
    console.log('Connecting to database...');
    
    // Create universities table
    await sql`
      CREATE TABLE IF NOT EXISTS universities (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        country VARCHAR(255) NOT NULL,
        program VARCHAR(255),
        deadline TIMESTAMP,
        status VARCHAR(50) DEFAULT 'researching',
        portal_url TEXT,
        application_fee NUMERIC(10, 2),
        fee_paid BOOLEAN DEFAULT false,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Created universities table.');

    // Create global_documents table
    await sql`
      CREATE TABLE IF NOT EXISTS global_documents (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        doc_name VARCHAR(255) NOT NULL,
        is_ready BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Created global_documents table.');

    console.log('Database setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating tables:', error);
    process.exit(1);
  }
}

createTables();
