import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "~/server/db/schema";
import { exercises as exerciseData } from "./exercieData";
import dotenv from 'dotenv';
dotenv.config();

const conn = postgres(process.env.DATABASE_URL!);
export const db = drizzle(conn, { schema });

async function seedExercises() {
  const isFresh = process.argv.includes('--fresh');
  // Clear existing data (optional, comment out if not desired)
  if (isFresh) {
    console.log("Deleting all exercices...");
    await db.delete(schema.exercises);
  }
  console.log("Seeding...");
  

  // Insert all exercises
  await db.insert(schema.exercises).values(exerciseData);
  console.log("Seeded exercises data!");
}

seedExercises().then(() => process.exit(0)).catch((e) => {
  console.error(e);
  process.exit(1);
}); 