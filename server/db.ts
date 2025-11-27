import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });

// Initialize required database indexes for poker seat uniqueness
// These partial unique indexes prevent race conditions in seat acquisition
export async function initializePokerIndexes(): Promise<void> {
  try {
    // Unique index for one active seat per position
    await pool.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_active_seat 
      ON poker_seats (table_id, seat_number) 
      WHERE is_active = true
    `);
    
    // Unique index for one active seat per player per table
    await pool.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_active_player 
      ON poker_seats (table_id, user_id) 
      WHERE is_active = true
    `);
    
    console.log("Poker seat uniqueness indexes initialized");
  } catch (error: any) {
    // Ignore if indexes already exist or table doesn't exist yet
    if (error.code !== '42P07' && error.code !== '42P01') {
      console.error("Failed to initialize poker indexes:", error);
    }
  }
}
