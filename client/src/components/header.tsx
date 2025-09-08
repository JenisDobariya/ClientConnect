import { useState } from "react";
import { Link } from "wouter";
import { Search, Film, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onSearch: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    // Debounced search - trigger search after user stops typing
    setTimeout(() => {
      onSearch(value);
    }, 500);
  };

  return (
    <header className="bg-vega-dark border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer" data-testid="logo">
              <Film className="text-vega-blue text-2xl" />
              <span className="text-2xl font-bold text-white">
                Vega<span className="text-vega-blue">Movies</span>
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search movies, TV shows..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full bg-vega-gray border-gray-700 pl-10 text-vega-text placeholder-gray-500 focus:border-vega-blue focus:ring-1 focus:ring-vega-blue"
                  data-testid="search-input"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              </div>
            </form>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="hover:text-vega-blue transition-colors" data-testid="nav-home">Home</Link>
            <a href="#" className="hover:text-vega-blue transition-colors" data-testid="nav-movies">Movies</a>
            <a href="#" className="hover:text-vega-blue transition-colors" data-testid="nav-tv-shows">TV Shows</a>
            <a href="#" className="hover:text-vega-blue transition-colors" data-testid="nav-genre">Genre</a>
          </nav>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="sm"
            className="md:hidden text-vega-text hover:text-vega-blue"
            data-testid="mobile-menu-btn"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
