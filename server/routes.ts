import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMovieSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all movies with optional filters
  app.get("/api/movies", async (req, res) => {
    try {
      const { category, genre, search, page = "1", limit = "24" } = req.query;
      
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      
      let result;
      
      if (search) {
        result = await storage.searchMovies(search as string, pageNum, limitNum);
      } else if (category && category !== "all") {
        result = await storage.getMoviesByCategory(category as string, pageNum, limitNum);
      } else if (genre && genre !== "all") {
        result = await storage.getMoviesByGenre(genre as string, pageNum, limitNum);
      } else {
        result = await storage.getAllMovies(pageNum, limitNum);
      }
      
      res.json({
        movies: result.movies,
        totalMovies: result.total,
        currentPage: pageNum,
        totalPages: Math.ceil(result.total / limitNum),
        hasNextPage: pageNum * limitNum < result.total,
        hasPrevPage: pageNum > 1
      });
    } catch (error) {
      console.error("Error fetching movies:", error);
      res.status(500).json({ message: "Failed to fetch movies" });
    }
  });

  // Get featured movies (must come BEFORE movie by ID route)
  app.get("/api/movies/featured", async (req, res) => {
    try {
      const movies = await storage.getFeaturedMovies();
      res.json(movies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured movies" });
    }
  });

  // Get movie by ID
  app.get("/api/movies/:id", async (req, res) => {
    try {
      const movie = await storage.getMovieById(req.params.id);
      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }
      res.json(movie);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch movie" });
    }
  });

  // Create a new movie
  app.post("/api/movies", async (req, res) => {
    try {
      const validatedData = insertMovieSchema.parse(req.body);
      const movie = await storage.createMovie(validatedData);
      res.status(201).json(movie);
    } catch (error) {
      res.status(400).json({ message: "Invalid movie data" });
    }
  });

  // Get available categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = [
        { id: "bollywood", name: "Bollywood Movies", icon: "fas fa-star" },
        { id: "hollywood", name: "Hollywood Movies", icon: "fas fa-globe" },
        { id: "dual-audio", name: "Dual Audio", icon: "fas fa-language" },
        { id: "telugu", name: "Telugu", icon: "fas fa-video" },
        { id: "tamil", name: "Tamil", icon: "fas fa-play-circle" },
        { id: "tv-shows", name: "TV Shows", icon: "fas fa-tv" }
      ];
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Get available genres
  app.get("/api/genres", async (req, res) => {
    try {
      const genres = [
        "Action", "Adventure", "Animation", "Comedy", "Crime", 
        "Drama", "Family", "Fantasy", "Horror", "Mystery", 
        "Romance", "Sci-Fi", "Sports", "Thriller", "War"
      ];
      res.json(genres);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch genres" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
