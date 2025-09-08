import { type Movie, type InsertMovie, type User, type InsertUser } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Movie operations
  getAllMovies(page?: number, limit?: number): Promise<{ movies: Movie[], total: number }>;
  getMovieById(id: string): Promise<Movie | undefined>;
  getMoviesByCategory(category: string, page?: number, limit?: number): Promise<{ movies: Movie[], total: number }>;
  getMoviesByGenre(genre: string, page?: number, limit?: number): Promise<{ movies: Movie[], total: number }>;
  searchMovies(query: string, page?: number, limit?: number): Promise<{ movies: Movie[], total: number }>;
  getFeaturedMovies(): Promise<Movie[]>;
  createMovie(movie: InsertMovie): Promise<Movie>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private movies: Map<string, Movie>;
  private isInitialized = false;
  private initPromise: Promise<void>;

  constructor() {
    this.users = new Map();
    this.movies = new Map();
    this.initPromise = this.initializeMovies();
  }

  private async fetchFirebaseData(): Promise<any[]> {
    try {
      const response = await fetch('https://extrademo-e605b-default-rtdb.firebaseio.com/.json');
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch Firebase data:', error);
      return [];
    }
  }

  private transformFirebaseData(firebaseData: any[]): InsertMovie[] {
    return firebaseData.map((item: any) => {
      // Extract year from release date
      const year = new Date(item["release date"] || item.created_at).getFullYear();
      
      // Get poster URL from images
      const posterImage = item.images?.find((img: any) => img.type === "Poster");
      const posterUrl = posterImage?.url || "https://via.placeholder.com/400x600/333/fff?text=No+Image";
      
      // Get screenshot URLs from images
      const screenshotUrls = item.images?.filter((img: any) => img.type === "Screenshot").map((img: any) => img.url) || [];
      
      // Extract qualities from links
      const qualities = item.links?.map((link: any) => link.resolution).filter((q: any) => q && typeof q === 'string') || ["720p"];
      const uniqueQualities = Array.from(new Set(qualities)).filter((q): q is string => typeof q === 'string');
      
      // Get all download links
      const downloadLinks = item.links?.filter((link: any) => 
        link.link_type === "Download" && link.url
      ).map((link: any) => JSON.stringify({
        resolution: link.resolution || "Unknown",
        url: link.url,
        size: link.size || null
      })) || [];
      
      // Get primary download URL (for backward compatibility)
      const downloadLink = item.links?.find((link: any) => link.link_type === "Download");
      
      // Determine category based on type and language
      let category = "bollywood";
      if (item.type?.toLowerCase().includes("series")) {
        category = "tv-shows";
      } else if (item.language === "Hindi" || item.country === "India") {
        category = "bollywood";
      } else {
        category = "hollywood";
      }
      
      // Generate genres based on plot keywords
      const plot = item.plot?.toLowerCase() || "";
      let genres = ["Drama"];
      if (plot.includes("action") || plot.includes("fight") || plot.includes("battle")) genres.push("Action");
      if (plot.includes("love") || plot.includes("romance")) genres.push("Romance");
      if (plot.includes("comedy") || plot.includes("funny")) genres.push("Comedy");
      if (plot.includes("thriller") || plot.includes("suspense")) genres.push("Thriller");
      if (plot.includes("crime") || plot.includes("police")) genres.push("Crime");
      if (plot.includes("horror") || plot.includes("scary")) genres.push("Horror");
      if (plot.includes("adventure")) genres.push("Adventure");
      
      // Generate rating (between 6.0 and 9.0)
      const rating = (6.0 + Math.random() * 3.0).toFixed(1);
      
      return {
        title: item.title || "Unknown Title",
        year: year || 2019,
        posterUrl,
        screenshotUrls,
        rating,
        genres: Array.from(new Set(genres)),
        languages: item.language ? [item.language] : ["Hindi"],
        qualities: uniqueQualities,
        category,
        synopsis: item.plot || "No synopsis available.",
        trailerUrl: null,
        downloadUrl: downloadLink?.url || null,
        downloadLinks: downloadLinks,
        featured: Math.random() < 0.3, // 30% chance of being featured
        releaseDate: new Date(item["release date"] || item.created_at).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        })
      };
    });
  }

  private async initializeMovies() {
    try {
      console.log("[MemStorage] Starting to load Firebase data...");
      const firebaseData = await this.fetchFirebaseData();
      console.log(`[MemStorage] Loaded ${firebaseData.length} movies from Firebase`);
      
      const moviesData = this.transformFirebaseData(firebaseData);

      moviesData.forEach(movie => {
        const id = randomUUID();
        const fullMovie: Movie = {
          ...movie,
          id,
          synopsis: movie.synopsis ?? null,
          trailerUrl: movie.trailerUrl ?? null,
          downloadUrl: movie.downloadUrl ?? null,
          downloadLinks: movie.downloadLinks || null,
          screenshotUrls: movie.screenshotUrls?.length ? movie.screenshotUrls : null,
          featured: movie.featured ?? false,
          createdAt: new Date()
        };
        this.movies.set(id, fullMovie);
      });
      
      this.isInitialized = true;
      console.log(`[MemStorage] Successfully initialized ${this.movies.size} movies`);
    } catch (error) {
      console.error("[MemStorage] Failed to initialize movies:", error);
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async getAllMovies(page: number = 1, limit: number = 24): Promise<{ movies: Movie[], total: number }> {
    const allMovies = Array.from(this.movies.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedMovies = allMovies.slice(startIndex, endIndex);
    
    return {
      movies: paginatedMovies,
      total: allMovies.length
    };
  }

  async getMovieById(id: string): Promise<Movie | undefined> {
    return this.movies.get(id);
  }

  async getMoviesByCategory(category: string, page: number = 1, limit: number = 24): Promise<{ movies: Movie[], total: number }> {
    const filteredMovies = Array.from(this.movies.values())
      .filter(movie => movie.category.toLowerCase() === category.toLowerCase())
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedMovies = filteredMovies.slice(startIndex, endIndex);
    
    return {
      movies: paginatedMovies,
      total: filteredMovies.length
    };
  }

  async getMoviesByGenre(genre: string, page: number = 1, limit: number = 24): Promise<{ movies: Movie[], total: number }> {
    const filteredMovies = Array.from(this.movies.values())
      .filter(movie => movie.genres.some(g => g.toLowerCase() === genre.toLowerCase()))
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedMovies = filteredMovies.slice(startIndex, endIndex);
    
    return {
      movies: paginatedMovies,
      total: filteredMovies.length
    };
  }

  async searchMovies(query: string, page: number = 1, limit: number = 24): Promise<{ movies: Movie[], total: number }> {
    const searchTerm = query.toLowerCase();
    const filteredMovies = Array.from(this.movies.values())
      .filter(movie => 
        movie.title.toLowerCase().includes(searchTerm) ||
        movie.genres.some(genre => genre.toLowerCase().includes(searchTerm)) ||
        movie.category.toLowerCase().includes(searchTerm)
      )
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedMovies = filteredMovies.slice(startIndex, endIndex);
    
    return {
      movies: paginatedMovies,
      total: filteredMovies.length
    };
  }

  async getFeaturedMovies(): Promise<Movie[]> {
    return Array.from(this.movies.values())
      .filter(movie => movie.featured)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createMovie(insertMovie: InsertMovie): Promise<Movie> {
    const id = randomUUID();
    const movie: Movie = {
      ...insertMovie,
      id,
      synopsis: insertMovie.synopsis ?? null,
      trailerUrl: insertMovie.trailerUrl ?? null,
      downloadUrl: insertMovie.downloadUrl ?? null,
      featured: insertMovie.featured ?? false,
      createdAt: new Date()
    };
    this.movies.set(id, movie);
    return movie;
  }
}

export const storage = new MemStorage();
