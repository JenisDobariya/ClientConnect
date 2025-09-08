import { Link } from "wouter";
import { Star, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Movie } from "@shared/schema";

interface MovieCardProps {
  movie: Movie;
  viewMode?: "grid" | "list";
}

export default function MovieCard({ movie, viewMode = "grid" }: MovieCardProps) {
  if (viewMode === "list") {
    return (
      <Link href={`/movie/${movie.id}`}>
        <div 
          className="group cursor-pointer bg-vega-gray rounded-xl border border-gray-800 hover:border-vega-blue/50 transition-all duration-300 p-4"
          data-testid={`movie-card-${movie.id}`}
        >
          <div className="flex gap-4">
            <div className="relative w-24 h-36 flex-shrink-0">
              <img 
                src={movie.posterUrl} 
                alt={`${movie.title} poster`}
                className="w-full h-full object-cover rounded-lg"
                data-testid={`movie-poster-${movie.id}`}
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-lg">
                <Play className="text-vega-blue text-2xl" />
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-white mb-1 group-hover:text-vega-blue transition-colors" data-testid={`movie-title-${movie.id}`}>
                {movie.title}
              </h3>
              <p className="text-sm text-gray-500 mb-2" data-testid={`movie-year-${movie.id}`}>
                {movie.year}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-2">
                {movie.qualities.slice(0, 2).map(quality => (
                  <Badge 
                    key={quality}
                    variant="secondary" 
                    className="bg-vega-blue/20 text-vega-blue border-none text-xs"
                  >
                    {quality}
                  </Badge>
                ))}
                <Badge 
                  variant="secondary" 
                  className="bg-vega-orange/20 text-vega-orange border-none text-xs"
                >
                  {movie.languages.includes("Hindi") && movie.languages.includes("English") ? "Dual Audio" : movie.languages[0]}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{movie.genres.slice(0, 2).join(", ")}</span>
                <span className="flex items-center">
                  <Star className="h-3 w-3 text-yellow-500 mr-1" />
                  {movie.rating}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/movie/${movie.id}`}>
      <div 
        className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
        data-testid={`movie-card-${movie.id}`}
      >
        <div className="relative bg-vega-gray rounded-xl overflow-hidden border border-gray-800 hover:border-vega-blue/50">
          <img 
            src={movie.posterUrl} 
            alt={`${movie.title} poster`}
            className="w-full h-72 object-cover"
            data-testid={`movie-poster-${movie.id}`}
          />
          
          {/* Quality Badge */}
          <div className="absolute top-2 left-2 bg-vega-blue/90 backdrop-blur px-2 py-1 rounded text-xs font-semibold text-white">
            {movie.qualities[0]}
          </div>
          
          {/* Language Badge */}
          <div className="absolute top-2 right-2 bg-vega-orange/90 backdrop-blur px-2 py-1 rounded text-xs font-semibold text-white">
            {movie.languages.includes("Hindi") && movie.languages.includes("English") ? "Dual Audio" : movie.languages[0]}
          </div>
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="text-center">
              <Play className="text-4xl text-vega-blue mb-2 mx-auto" />
              <p className="text-sm text-white">Watch Now</p>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-white mb-1 group-hover:text-vega-blue transition-colors" data-testid={`movie-title-${movie.id}`}>
            {movie.title}
          </h3>
          <p className="text-sm text-gray-500 mb-2" data-testid={`movie-year-${movie.id}`}>
            {movie.year}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>{movie.genres.slice(0, 2).join(", ")}</span>
            <span className="flex items-center">
              <Star className="h-3 w-3 text-yellow-500 mr-1" />
              {movie.rating}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
