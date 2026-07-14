"use client";

export default function Pagination({ pagination, limit, onLimitChange, onPageChange }) {
  if (!pagination) return null;

  const { currentPage, totalPages, totalRooms } = pagination;
  const startItem = totalRooms === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalRooms);

  const pageNumbers = [];
  for (let p = 1; p <= totalPages; p += 1) pageNumbers.push(p);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/5 px-6 py-4 text-sm text-trinity-900/70">
      <p>
        Showing {startItem} to {endItem} of {totalRooms} rooms
      </p>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          {[10, 20, 50].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onLimitChange(n)}
              className={`rounded-md px-2 py-1 ${
                limit === n ? "bg-trinity-100 font-medium text-trinity-700" : "hover:bg-cream"
              }`}
            >
              {n}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="rounded-md px-2 py-1 disabled:opacity-40 hover:bg-cream"
          >
            &lt; Previous
          </button>
          {pageNumbers.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`h-7 w-7 rounded-md ${
                p === currentPage
                  ? "bg-trinity-500 text-white font-medium"
                  : "hover:bg-cream"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="rounded-md px-2 py-1 disabled:opacity-40 hover:bg-cream"
          >
            Next &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
