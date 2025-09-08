import { useQuery } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface SidebarProps {
  selectedCategory: string;
  selectedGenre: string;
  onCategoryChange: (category: string) => void;
  onGenreChange: (genre: string) => void;
}

export default function Sidebar({ 
  selectedCategory, 
  selectedGenre, 
  onCategoryChange, 
  onGenreChange 
}: SidebarProps) {
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const { data: genres } = useQuery<string[]>({
    queryKey: ['/api/genres'],
  });

  return (
    <aside className="w-64 bg-vega-dark border-r border-gray-800 hidden lg:block">
      <div className="p-6">
        {/* Categories */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
          <div className="space-y-2">
            <button
              onClick={() => onCategoryChange("all")}
              className={`flex items-center space-x-3 p-2 rounded-lg hover:bg-vega-gray transition-colors group w-full text-left ${
                selectedCategory === "all" ? "bg-vega-gray text-vega-blue" : ""
              }`}
              data-testid="category-all"
            >
              <i className="fas fa-home text-vega-orange"></i>
              <span className="group-hover:text-vega-blue">All Movies</span>
            </button>
            
            {categories?.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`flex items-center space-x-3 p-2 rounded-lg hover:bg-vega-gray transition-colors group w-full text-left ${
                  selectedCategory === category.id ? "bg-vega-gray text-vega-blue" : ""
                }`}
                data-testid={`category-${category.id}`}
              >
                <i className={`${category.icon} text-vega-orange`}></i>
                <span className="group-hover:text-vega-blue">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Genres */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Genres</h3>
          <div className="space-y-2">
            <button
              onClick={() => onGenreChange("all")}
              className={`block p-2 rounded-lg hover:bg-vega-gray hover:text-vega-blue transition-colors w-full text-left ${
                selectedGenre === "all" ? "bg-vega-gray text-vega-blue" : ""
              }`}
              data-testid="genre-all"
            >
              All Genres
            </button>
            
            {genres?.map((genre) => (
              <button
                key={genre}
                onClick={() => onGenreChange(genre)}
                className={`block p-2 rounded-lg hover:bg-vega-gray hover:text-vega-blue transition-colors w-full text-left ${
                  selectedGenre === genre ? "bg-vega-gray text-vega-blue" : ""
                }`}
                data-testid={`genre-${genre.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Quality Filter */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Quality</h3>
          <div className="space-y-2">
            {["1080p", "720p", "480p"].map((quality) => (
              <label 
                key={quality}
                className="flex items-center space-x-2 cursor-pointer hover:text-vega-blue transition-colors"
                data-testid={`quality-filter-${quality}`}
              >
                <Checkbox className="border-gray-600 bg-vega-gray text-vega-blue" />
                <span>{quality}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Sponsored Ads */}
        <div className="space-y-6">
          {/* Premium Streaming Ad */}
          <div className="bg-gradient-to-r from-vega-blue/20 to-vega-orange/20 rounded-xl p-4 border border-vega-blue/30">
            <div className="text-xs text-gray-400 mb-2">SPONSORED</div>
            <h4 className="text-white font-semibold mb-2">🎬 Premium Streaming</h4>
            <p className="text-sm text-gray-300 mb-3">Watch HD movies without ads. Get 30 days free!</p>
            <button className="w-full bg-vega-blue hover:bg-vega-blue/80 text-white text-sm py-2 px-3 rounded-lg transition-colors">
              Try Free Now
            </button>
          </div>

          {/* VPN Ad */}
          <div className="bg-gradient-to-r from-green-900/30 to-green-700/30 rounded-xl p-4 border border-green-600/30">
            <div className="text-xs text-gray-400 mb-2">SPONSORED</div>
            <h4 className="text-white font-semibold mb-2">🔒 SecureVPN</h4>
            <p className="text-sm text-gray-300 mb-3">Stream safely with military-grade encryption</p>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-3 rounded-lg transition-colors">
              Get VPN
            </button>
          </div>

          {/* Gaming Ad */}
          <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl p-4 border border-purple-600/30">
            <div className="text-xs text-gray-400 mb-2">SPONSORED</div>
            <h4 className="text-white font-semibold mb-2">🎮 Epic Games Store</h4>
            <p className="text-sm text-gray-300 mb-3">Free games every week + exclusive deals</p>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 px-3 rounded-lg transition-colors">
              Claim Games
            </button>
          </div>

          {/* Movie Banner Ad */}
          <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 rounded-xl p-4 border border-red-600/30">
            <div className="text-xs text-gray-400 mb-2">FEATURED</div>
            <h4 className="text-white font-semibold mb-2">🍿 Movie Night Deals</h4>
            <p className="text-sm text-gray-300 mb-3">Get discounts on latest blockbusters</p>
            <button className="w-full bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-3 rounded-lg transition-colors">
              Shop Now
            </button>
          </div>

          {/* Newsletter Signup */}
          <div className="bg-vega-gray rounded-xl p-4 border border-gray-700">
            <h4 className="text-white font-semibold mb-2">📧 Stay Updated</h4>
            <p className="text-sm text-gray-300 mb-3">Get notifications for new movie releases</p>
            <div className="space-y-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-vega-dark border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:border-vega-blue focus:outline-none"
              />
              <button className="w-full bg-vega-orange hover:bg-vega-orange/80 text-white text-sm py-2 px-3 rounded-lg transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
