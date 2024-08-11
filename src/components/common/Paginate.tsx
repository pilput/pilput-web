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
  limit: number;
  Offset: number;
  total: number;
  length: number;
  currentPage: number;
}

export function Paginate(props: MyComponentProps) {
  return (
    <div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href={`?page=${props.currentPage - 1}`}
              className={props.Offset <= 0 ? "pointer-events-none" : ""}
              onClick={props.prev}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href={`?page=${props.currentPage + 1}`}
              className={
                props.length + props.Offset >= props.total
                  ? "pointer-events-none"
                  : ""
              }
              onClick={props.next}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
