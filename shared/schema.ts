import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const movies = pgTable("movies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  year: integer("year").notNull(),
  posterUrl: text("poster_url").notNull(),
  screenshotUrls: text("screenshot_urls").array(),
  rating: text("rating").notNull(),
  genres: text("genres").array().notNull(),
  languages: text("languages").array().notNull(),
  qualities: text("qualities").array().notNull(),
  category: text("category").notNull(), // bollywood, hollywood, dual-audio, telugu, tamil, tv-shows
  synopsis: text("synopsis"),
  trailerUrl: text("trailer_url"),
  downloadUrl: text("download_url"),
  downloadLinks: text("download_links").array(), // JSON strings of {resolution, url, size?}
  featured: boolean("featured").default(false),
  releaseDate: text("release_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMovieSchema = createInsertSchema(movies).omit({
  id: true,
  createdAt: true,
});

export type InsertMovie = z.infer<typeof insertMovieSchema>;
export type Movie = typeof movies.$inferSelect;

// Users table for authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
