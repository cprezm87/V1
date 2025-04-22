import { sql } from "@neondatabase/serverless"

export async function createTablesIfNotExist() {
  try {
    // Crear tabla figures si no existe
    await sql`
      CREATE TABLE IF NOT EXISTS figures (
        id SERIAL PRIMARY KEY,
        original_id TEXT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        franchise TEXT NOT NULL,
        brand TEXT NOT NULL,
        serie TEXT,
        year_released TEXT NOT NULL,
        condition TEXT NOT NULL,
        price TEXT NOT NULL,
        year_purchase TEXT NOT NULL,
        upc TEXT,
        logo TEXT,
        photo TEXT,
        tagline TEXT,
        review TEXT,
        shelf TEXT NOT NULL,
        display TEXT NOT NULL,
        ranking INTEGER NOT NULL,
        comments TEXT,
        user_id TEXT NOT NULL
      )
    `

    // Crear tabla wishlist si no existe
    await sql`
      CREATE TABLE IF NOT EXISTS wishlist (
        id SERIAL PRIMARY KEY,
        original_id TEXT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        franchise TEXT NOT NULL,
        brand TEXT NOT NULL,
        serie TEXT,
        year_released TEXT NOT NULL,
        price TEXT NOT NULL,
        logo TEXT,
        photo TEXT,
        tagline TEXT,
        review TEXT,
        released BOOLEAN NOT NULL,
        buy BOOLEAN NOT NULL,
        comments TEXT,
        tracking_number TEXT,
        user_id TEXT NOT NULL
      )
    `

    // Crear tabla customs si no existe
    await sql`
      CREATE TABLE IF NOT EXISTS customs (
        id SERIAL PRIMARY KEY,
        original_id TEXT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        franchise TEXT NOT NULL,
        head TEXT NOT NULL,
        body TEXT NOT NULL,
        logo TEXT,
        tagline TEXT,
        comments TEXT,
        user_id TEXT NOT NULL
      )
    `

    // Crear tabla movie_anniversaries si no existe
    await sql`
      CREATE TABLE IF NOT EXISTS movie_anniversaries (
        id SERIAL PRIMARY KEY,
        original_id TEXT,
        title TEXT NOT NULL,
        release_date DATE NOT NULL,
        poster TEXT NOT NULL,
        trailer TEXT,
        comments TEXT,
        user_id TEXT NOT NULL
      )
    `

    return true
  } catch (error) {
    console.error("Error creating tables:", error)
    throw error
  }
}
