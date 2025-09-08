import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import MovieCard from "@/components/movie-card";
import Pagination from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Grid, List, Star } from "lucide-react";
import type { Movie } from "@shared/schema";

interface MoviesResponse {
  movies: Movie[];
  totalMovies: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("latest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Fetch movies with filters
  const { data: moviesData, isLoading: moviesLoading } = useQuery<MoviesResponse>({
    queryKey: ['/api/movies', searchQuery, selectedCategory, selectedGenre, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.set('search', searchQuery);
      if (selectedCategory !== "all") params.set('category', selectedCategory);
      if (selectedGenre !== "all") params.set('genre', selectedGenre);
      params.set('page', currentPage.toString());
      params.set('limit', '24');
      
      const url = `/api/movies?${params.toString()}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch movies');
      return response.json();
    },
  });

  // Fetch featured movies
  const { data: featuredMovies } = useQuery<Movie[]>({
    queryKey: ['/api/movies/featured'],
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
    setCurrentPage(1);
  };

  const featuredMovie = featuredMovies?.[0];

  return (
    <div className="min-h-screen bg-vega-darker text-vega-text font-inter">
      <Header onSearch={handleSearch} />
      
      <div className="flex">
        <Sidebar 
          selectedCategory={selectedCategory}
          selectedGenre={selectedGenre}
          onCategoryChange={handleCategoryChange}
          onGenreChange={handleGenreChange}
        />
        
        <main className="flex-1 p-6">
          {/* Featured Section */}
          {featuredMovie && (
            <section className="mb-8">
              <div 
                className="bg-gradient-to-r from-vega-blue/20 to-vega-orange/20 rounded-2xl p-8 border border-gray-800"
                data-testid="featured-section"
              >
                <div className="flex flex-col md:flex-row items-center">
                  <div className="flex-1 mb-6 md:mb-0">
                    <h2 className="text-3xl font-bold text-white mb-4">Latest Movies & TV Shows</h2>
                    <p className="text-vega-text mb-6">
                      Watch the latest Bollywood, Hollywood, and regional movies in HD quality. 
                      Stream or download your favorite content.
                    </p>
                    <div className="flex flex-wrap gap-3 mb-4">
                      <Badge variant="secondary" className="bg-vega-blue/20 text-vega-blue border-none">
                        HD Quality
                      </Badge>
                      <Badge variant="secondary" className="bg-vega-orange/20 text-vega-orange border-none">
                        Dual Audio
                      </Badge>
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-none">
                        Latest Updates
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full md:w-64 h-80 bg-vega-gray rounded-xl border border-gray-700 overflow-hidden">
                    <img 
                      src={featuredMovie.posterUrl} 
                      alt={`${featuredMovie.title} poster`}
                      className="w-full h-full object-cover"
                      data-testid="featured-movie-poster"
                    />
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Filter and Sort Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-white">Latest Movies</h2>
              <span className="text-sm text-gray-500" data-testid="total-movies">
                {moviesData?.totalMovies || 0} movies available • Page {moviesData?.currentPage || 1} of {moviesData?.totalPages || 1}
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger 
                  className="bg-vega-gray border-gray-700 text-vega-text focus:border-vega-blue"
                  data-testid="sort-select"
                >
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-vega-gray border-gray-700">
                  <SelectItem value="latest">Sort by Latest</SelectItem>
                  <SelectItem value="rating">Sort by Rating</SelectItem>
                  <SelectItem value="year">Sort by Year</SelectItem>
                  <SelectItem value="name">Sort by Name</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex border border-gray-700 rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  className={`${viewMode === "grid" ? 'bg-vega-blue text-white' : 'bg-vega-gray hover:bg-gray-600'}`}
                  onClick={() => setViewMode("grid")}
                  data-testid="grid-view-btn"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  className={`${viewMode === "list" ? 'bg-vega-blue text-white' : 'bg-vega-gray hover:bg-gray-600'}`}
                  onClick={() => setViewMode("list")}
                  data-testid="list-view-btn"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Movies Grid */}
          {moviesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-8">
              {[...Array(24)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-vega-gray rounded-xl h-72 mb-4"></div>
                  <div className="bg-vega-gray rounded h-4 mb-2"></div>
                  <div className="bg-vega-gray rounded h-3 w-1/2"></div>
                </div>
              ))}
            </div>
          ) : moviesData?.movies.length === 0 ? (
            <div className="text-center py-12" data-testid="no-movies-message">
              <h3 className="text-lg font-semibold text-white mb-2">No movies found</h3>
              <p className="text-gray-400">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div 
              className={viewMode === "grid" 
                ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-8"
                : "space-y-4 mb-8"
              }
              data-testid="movies-grid"
            >
              {moviesData?.movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} viewMode={viewMode} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {moviesData && moviesData.totalPages > 1 && (
            <Pagination
              currentPage={moviesData.currentPage}
              totalPages={moviesData.totalPages}
              hasNextPage={moviesData.hasNextPage}
              hasPrevPage={moviesData.hasPrevPage}
              onPageChange={setCurrentPage}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-vega-dark border-t border-gray-800 py-12 mt-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <i className="fas fa-film text-vega-blue text-2xl"></i>
                <span className="text-2xl font-bold text-white">
                  Vega<span className="text-vega-blue">Movies</span>
                </span>
              </div>
              <p className="text-gray-400 mb-4">
                Watch and download latest movies and TV shows in HD quality. Your entertainment destination.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-vega-blue transition-colors">Bollywood Movies</a></li>
                <li><a href="#" className="text-gray-400 hover:text-vega-blue transition-colors">Hollywood Movies</a></li>
                <li><a href="#" className="text-gray-400 hover:text-vega-blue transition-colors">Dual Audio Movies</a></li>
                <li><a href="#" className="text-gray-400 hover:text-vega-blue transition-colors">TV Shows</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Categories</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-vega-blue transition-colors">Action Movies</a></li>
                <li><a href="#" className="text-gray-400 hover:text-vega-blue transition-colors">Comedy Movies</a></li>
                <li><a href="#" className="text-gray-400 hover:text-vega-blue transition-colors">Drama Movies</a></li>
                <li><a href="#" className="text-gray-400 hover:text-vega-blue transition-colors">Horror Movies</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Quality</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-vega-blue transition-colors">1080p Movies</a></li>
                <li><a href="#" className="text-gray-400 hover:text-vega-blue transition-colors">720p Movies</a></li>
                <li><a href="#" className="text-gray-400 hover:text-vega-blue transition-colors">480p Movies</a></li>
                <li><a href="#" className="text-gray-400 hover:text-vega-blue transition-colors">300MB Movies</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2025 VegaMovies. All rights reserved. This is a design mockup for demonstration purposes.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
