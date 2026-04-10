"use client";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

interface MyComponentProps {
  prev: () => void;
  next: () => void;
  goToPage: (page: number) => void; // Add function to go to specific page
  limit: number;
  offset: number;
  total: number;
  length: number;
  currentPage: number;
  /** When set, used for link hrefs (e.g. `?page=2&q=foo`). Defaults to legacy `?page=<0-based index>`. */
  getPageHref?: (pageIndex: number) => string;
}

export function Paginate(props: MyComponentProps) {
  const hrefFor = (pageIndex: number) =>
    props.getPageHref ? props.getPageHref(pageIndex) : `?page=${pageIndex}`;

  // Calculate total pages
  const totalPages = Math.ceil(props.total / props.limit);
  
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Maximum number of page links to show
    
    if (totalPages <= maxPagesToShow) {
      // If total pages are less than max to show, display all pages
      for (let i = 0; i < totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page
      pageNumbers.push(0);
      
      // Calculate start and end of page range around current page
      let startPage = Math.max(1, props.currentPage - 1);
      let endPage = Math.min(totalPages - 2, props.currentPage + 1);
      
      // Adjust if we're near the beginning
      if (props.currentPage < 2) {
        endPage = 3;
      }
      
      // Adjust if we're near the end
      if (props.currentPage > totalPages - 3) {
        startPage = totalPages - 4;
      }
      
      // Add ellipsis before middle pages if needed
      if (startPage > 1) {
        pageNumbers.push(-1); // -1 represents ellipsis
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis after middle pages if needed
      if (endPage < totalPages - 2) {
        pageNumbers.push(-2); // -2 represents ellipsis
      }
      
      // Always include last page
      pageNumbers.push(totalPages - 1);
    }
    
    return pageNumbers;
  };
  
  return (
    <div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              href={hrefFor(Math.max(0, props.currentPage - 1))}
              className={props.offset <= 0 ? "pointer-events-none opacity-50" : ""}
              onClick={(e) => {
                e.preventDefault();
                if (props.offset > 0) props.prev();
              }}
            />
          </PaginationItem>
          
          {getPageNumbers().map((pageIndex, index) => {
            // If pageIndex is negative, it's an ellipsis
            if (pageIndex < 0) {
              return (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }
            
            return (
              <PaginationItem key={`page-${pageIndex}`}>
                <PaginationLink 
                  href={hrefFor(pageIndex)}
                  isActive={pageIndex === props.currentPage}
                  onClick={(e) => {
                    e.preventDefault();
                    if (pageIndex !== props.currentPage) {
                      // Go to the selected page
                      props.goToPage(pageIndex);
                    }
                  }}
                >
                  {pageIndex + 1}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          
          <PaginationItem>
            <PaginationNext 
              href={hrefFor(
                Math.min(totalPages - 1, props.currentPage + 1)
              )}
              className={
                props.length + props.offset >= props.total
                  ? "pointer-events-none opacity-50"
                  : ""
              }
              onClick={(e) => {
                e.preventDefault();
                if (props.length + props.offset < props.total) props.next();
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
