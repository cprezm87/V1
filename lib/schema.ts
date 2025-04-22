import { pgTable, serial, text, date, boolean, integer } from "drizzle-orm/pg-core"

// Tabla para los items de la colección (Checklist)
export const figuresTable = pgTable("figures", {
  id: serial("id").primaryKey(),
  originalId: text("original_id"),
  name: text("name").notNull(),
  type: text("type").notNull(),
  franchise: text("franchise").notNull(),
  brand: text("brand").notNull(),
  serie: text("serie"),
  yearReleased: text("year_released").notNull(),
  condition: text("condition").notNull(),
  price: text("price").notNull(),
  yearPurchase: text("year_purchase").notNull(),
  upc: text("upc"),
  logo: text("logo"),
  photo: text("photo"),
  tagline: text("tagline"),
  review: text("review"),
  shelf: text("shelf").notNull(),
  display: text("display").notNull(),
  ranking: integer("ranking").notNull(),
  comments: text("comments"),
  userId: text("user_id").notNull(),
})

// Tabla para los items de la lista de deseos (Wishlist)
export const wishlistTable = pgTable("wishlist", {
  id: serial("id").primaryKey(),
  originalId: text("original_id"),
  name: text("name").notNull(),
  type: text("type").notNull(),
  franchise: text("franchise").notNull(),
  brand: text("brand").notNull(),
  serie: text("serie"),
  yearReleased: text("year_released").notNull(),
  price: text("price").notNull(),
  logo: text("logo"),
  photo: text("photo"),
  tagline: text("tagline"),
  review: text("review"),
  released: boolean("released").notNull(),
  buy: boolean("buy").notNull(),
  comments: text("comments"),
  trackingNumber: text("tracking_number"),
  userId: text("user_id").notNull(),
})

// Tabla para los items personalizados (Customs)
export const customsTable = pgTable("customs", {
  id: serial("id").primaryKey(),
  originalId: text("original_id"),
  name: text("name").notNull(),
  type: text("type").notNull(),
  franchise: text("franchise").notNull(),
  head: text("head").notNull(),
  body: text("body").notNull(),
  logo: text("logo"),
  tagline: text("tagline"),
  comments: text("comments"),
  userId: text("user_id").notNull(),
})

// Tabla para los aniversarios de películas (Movie Anniversaries)
export const movieAnniversariesTable = pgTable("movie_anniversaries", {
  id: serial("id").primaryKey(),
  originalId: text("original_id"),
  title: text("title").notNull(),
  releaseDate: date("release_date").notNull(),
  poster: text("poster").notNull(),
  trailer: text("trailer"),
  comments: text("comments"),
  userId: text("user_id").notNull(),
})
