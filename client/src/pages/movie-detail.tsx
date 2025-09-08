import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Play, Download, Star, Calendar, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/header";
import { Link } from "wouter";
import type { Movie } from "@shared/schema";

export default function MovieDetail() {
  const { id } = useParams();

  const { data: movie, isLoading } = useQuery<Movie>({
    queryKey: ['/api/movies', id],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-vega-darker text-vega-text">
        <Header onSearch={() => {}} />
        <div className="container mx-auto px-6 py-8">
          <div className="animate-pulse">
            <div className="bg-vega-gray rounded h-8 w-32 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-vega-gray rounded-xl h-96"></div>
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-vega-gray rounded h-8 w-3/4"></div>
                <div className="bg-vega-gray rounded h-4 w-1/2"></div>
                <div className="bg-vega-gray rounded h-24"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-vega-darker text-vega-text">
        <Header onSearch={() => {}} />
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Movie not found</h1>
            <Button 
              className="bg-vega-blue hover:bg-vega-blue/80"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Movies
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vega-darker text-vega-text">
      <Header onSearch={() => {}} />
      
      <div className="container mx-auto px-6 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6 text-vega-text hover:text-vega-blue"
          onClick={() => window.history.back()}
          data-testid="back-button"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Movies
        </Button>

        {/* Movie Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Movie Poster */}
          <div className="lg:col-span-1">
            <div className="bg-vega-gray rounded-xl overflow-hidden border border-gray-800">
              <img 
                src={movie.posterUrl} 
                alt={`${movie.title} poster`}
                className="w-full h-auto object-cover"
                data-testid="movie-poster"
              />
            </div>
          </div>

          {/* Movie Info */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-white mb-2" data-testid="movie-title">
                {movie.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {movie.year}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  {movie.rating}
                </span>
                <span className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  {movie.languages.join(", ")}
                </span>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.qualities.map(quality => (
                <Badge 
                  key={quality}
                  variant="secondary" 
                  className="bg-vega-blue/20 text-vega-blue border-none"
                  data-testid={`quality-badge-${quality}`}
                >
                  {quality}
                </Badge>
              ))}
              {movie.genres.map(genre => (
                <Badge 
                  key={genre}
                  variant="outline" 
                  className="border-gray-600 text-vega-text"
                  data-testid={`genre-badge-${genre}`}
                >
                  {genre}
                </Badge>
              ))}
              <Badge 
                variant="secondary" 
                className="bg-vega-orange/20 text-vega-orange border-none"
                data-testid="category-badge"
              >
                {movie.category.replace('-', ' ').toUpperCase()}
              </Badge>
            </div>

            {/* Synopsis */}
            {movie.synopsis && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Synopsis</h3>
                <p className="text-vega-text leading-relaxed" data-testid="movie-synopsis">
                  {movie.synopsis}
                </p>
              </div>
            )}

            {/* Movie Details */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Movie Details</h4>
                <dl className="space-y-2">
                  <div className="flex">
                    <dt className="text-gray-400 w-24">Release:</dt>
                    <dd className="text-vega-text" data-testid="release-date">{movie.releaseDate}</dd>
                  </div>
                  <div className="flex">
                    <dt className="text-gray-400 w-24">Category:</dt>
                    <dd className="text-vega-text" data-testid="movie-category">
                      {movie.category.replace('-', ' ').toUpperCase()}
                    </dd>
                  </div>
                  <div className="flex">
                    <dt className="text-gray-400 w-24">Languages:</dt>
                    <dd className="text-vega-text" data-testid="movie-languages">
                      {movie.languages.join(", ")}
                    </dd>
                  </div>
                  <div className="flex">
                    <dt className="text-gray-400 w-24">Quality:</dt>
                    <dd className="text-vega-text" data-testid="movie-qualities">
                      {movie.qualities.join(", ")}
                    </dd>
                  </div>
                </dl>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Genres</h4>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map(genre => (
                    <Badge 
                      key={genre}
                      variant="outline" 
                      className="border-gray-600 text-vega-text"
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Screenshots Gallery */}
            {movie.screenshotUrls && movie.screenshotUrls.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-white mb-4">Screenshots</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {movie.screenshotUrls.map((screenshotUrl, index) => (
                    <div 
                      key={index} 
                      className="bg-vega-gray rounded-xl overflow-hidden border border-gray-800 cursor-pointer hover:border-vega-blue transition-colors group"
                      onClick={() => window.open(screenshotUrl, '_blank')}
                      data-testid={`screenshot-${index}`}
                    >
                      <img 
                        src={screenshotUrl} 
                        alt={`${movie.title} screenshot ${index + 1}`}
                        className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-200"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 space-y-6">
              {/* Trailer Button */}
              {movie.trailerUrl && (
                <div>
                  <Button 
                    className="bg-vega-blue hover:bg-vega-blue/80 text-white"
                    onClick={() => window.open(movie.trailerUrl!, '_blank')}
                    data-testid="watch-trailer-btn"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Watch Trailer
                  </Button>
                </div>
              )}

              {/* Download Section */}
              {movie.downloadLinks && movie.downloadLinks.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Download className="w-5 h-5 mr-2 text-vega-orange" />
                    Download Options
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {movie.downloadLinks.map((linkStr, index) => {
                      try {
                        const link = JSON.parse(linkStr);
                        return (
                          <Button
                            key={index}
                            variant="outline"
                            className="border-vega-orange text-vega-orange hover:bg-vega-orange hover:text-white p-4 h-auto flex flex-col items-center gap-2"
                            onClick={() => window.open(link.url, '_blank')}
                            data-testid={`download-btn-${link.resolution}`}
                          >
                            <div className="flex items-center gap-2">
                              <Download className="w-4 h-4" />
                              <span className="font-semibold">{link.resolution}</span>
                            </div>
                            {link.size && (
                              <span className="text-xs opacity-75">{link.size}</span>
                            )}
                          </Button>
                        );
                      } catch (e) {
                        return null;
                      }
                    })}
                  </div>
                </div>
              )}

              {/* Fallback single download button */}
              {(!movie.downloadLinks || movie.downloadLinks.length === 0) && movie.downloadUrl && (
                <div>
                  <Button 
                    variant="outline" 
                    className="border-vega-orange text-vega-orange hover:bg-vega-orange hover:text-white"
                    onClick={() => window.open(movie.downloadUrl!, '_blank')}
                    data-testid="download-btn"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
