import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
}

export default function Pagination({ 
  currentPage, 
  totalPages, 
  hasNextPage, 
  hasPrevPage, 
  onPageChange 
}: PaginationProps) {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="mt-12" data-testid="pagination">
      {/* Enhanced Pagination Info */}
      <div className="text-center mb-8">
        <div className="bg-vega-gray/50 rounded-lg p-4 inline-block">
          <p className="text-vega-text text-base">
            Page <span className="text-vega-blue font-bold text-xl">{currentPage}</span> of{" "}
            <span className="text-vega-orange font-bold text-xl">{totalPages}</span>
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Showing 24 movies per page • {(totalPages * 24).toLocaleString()} total movies
          </p>
        </div>
      </div>

      {/* Main Pagination Controls */}
      <div className="flex justify-center items-center space-x-2 flex-wrap gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage}
          className="px-4 py-2 bg-vega-gray hover:bg-vega-blue hover:text-white text-vega-text rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="prev-page-btn"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        
        {visiblePages.map((page, index) => (
          page === '...' ? (
            <span key={`dots-${index}`} className="px-4 py-2 text-gray-500">
              ...
            </span>
          ) : (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "ghost"}
              size="sm"
              onClick={() => onPageChange(page as number)}
              className={
                currentPage === page 
                  ? "px-4 py-2 bg-vega-blue text-white rounded-lg shadow-lg transform scale-105"
                  : "px-4 py-2 bg-vega-gray hover:bg-vega-blue hover:text-white text-vega-text rounded-lg transition-all duration-200"
              }
              data-testid={`page-btn-${page}`}
            >
              {page}
            </Button>
          )
        ))}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          className="px-4 py-2 bg-vega-gray hover:bg-vega-blue hover:text-white text-vega-text rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="next-page-btn"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* Special "Explore More" Button for Page 1 */}
      {currentPage === 1 && totalPages >= 2 && (
        <div className="text-center mt-8">
          <div className="bg-gradient-to-r from-vega-blue/20 to-vega-orange/20 rounded-xl p-6 border border-vega-blue/30">
            <h3 className="text-lg font-semibold text-white mb-2">
              More Movies Available!
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Discover {((totalPages - 1) * 24).toLocaleString()}+ more movies across {totalPages - 1} additional pages
            </p>
            <Button
              onClick={() => onPageChange(2)}
              className="px-8 py-4 bg-gradient-to-r from-vega-blue to-vega-orange text-white rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-base font-semibold"
              data-testid="explore-more-btn"
            >
              🎬 Explore More Movies →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
