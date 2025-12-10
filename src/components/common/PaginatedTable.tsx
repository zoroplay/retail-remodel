import { getClientTheme } from "@/config/theme.config";
import { FileText } from "lucide-react";
import React from "react";
import {
  BsChevronDoubleLeft,
  BsChevronDoubleRight,
  BsChevronLeft,
  BsChevronRight,
} from "react-icons/bs";
const { classes } = getClientTheme();
const pageClasses = classes.transactions_page;

interface TableColumn {
  id: string;
  name: string;
  className?: string;
  render?: (value: any, row: any, rowIndex: number) => React.ReactNode;
}
interface PaginationProps {
  currentPage: number;
  total: number;
  perPage: number;
  onPageChange: (page: number) => void;
  nextPage: number;
  lastPage: number;
  prevPage: number;
}

interface PaginatedTableProps {
  columns: TableColumn[];
  data: any[];
  isLoading?: boolean;
  pagination?: PaginationProps;
  className: string;
  bodyClassName?: string;
}

const PaginatedTable: React.FC<PaginatedTableProps> = ({
  columns,
  data,
  isLoading = false,
  pagination,
  className,
  bodyClassName = `shadow-lg border rounded-md ${classes.sports_page["card-border"]}`,
}) => {
  console.log("pagination", pagination);

  let base_styles = "";
  if (className) {
    base_styles += ` ${className}`;
  } else {
    switch (columns.length) {
      case 5:
        base_styles += " grid-cols-5";
        break;
      case 6:
        base_styles += " grid-cols-6";
        break;
      case 7:
        base_styles += " grid-cols-7";
        break;
      case 8:
        base_styles += " grid-cols-8";
        break;
    }
  }
  //   grid-cols-[repeat(17,minmax(0,1fr))]
  return (
    <div
      className={`overflow-hidden ${bodyClassName} ${classes.sports_page["card-bg"]} flex flex-col h-full `}
    >
      {/* Table Header - Static */}
      <div
        className={` ${classes.sports_page["header-text"]} ${classes.sports_page["header-bg"]} w-full text-xs ${pageClasses["column-header-text"]} pl-1`}
      >
        <div className={` grid gap-2 ${base_styles}`}>
          {columns.map((item, index) => (
            <div
              key={index}
              className={`${item.className}  text-xs font-semibold tracking-wide whitespace-nowrap  ${pageClasses["column-header-text"]} p-2 py-2`}
            >
              {item.name}
            </div>
          ))}
        </div>
      </div>

      {/* Table Rows - Scrollable */}
      <div className="flex-1 gap-2 h-full overflow-y-auto">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, rowIndex) => (
            <div
              key={`skeleton-row-${rowIndex}`}
              className={`border-b border-l-4 border-l-transparent ${pageClasses["card-border"]}`}
            >
              <div
                className={`${base_styles} grid p-1 px-2  animate-pulse gap-1`}
              >
                {columns.map((col, colIndex) => (
                  <span
                    key={`skeleton-cell-${col.id}-${colIndex}`}
                    className={`h-6 rounded ${
                      classes["skeleton-bg"]
                    } flex-1 p-2 ${col.className || pageClasses["row-text"]} ${
                      colIndex !== 0 ? "border-gray-700 pl-1" : ""
                    }`}
                  ></span>
                ))}
              </div>
            </div>
          ))
        ) : !data || data?.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 p-10">
            <div
              className={`w-14 h-14 ${pageClasses["input-bg"]} rounded-full flex items-center justify-center`}
            >
              <FileText size={26} className={pageClasses["row-text"]} />
            </div>
            <div className="text-center">
              <p
                className={`text-base font-semibold ${pageClasses["row-text"]} mb-1`}
              >
                No Data found
              </p>
              <p className={`text-xs ${pageClasses["row-text"]} opacity-60`}>
                {"Try adjusting your filters or date range"}
              </p>
            </div>
          </div>
        ) : (
          data?.map((row: any, rowIndex: number) => (
            <div
              key={row.id || rowIndex}
              className={`border-b border-l-4 border-l-transparent ${classes["item-hover-border-l"]}  ${pageClasses["card-border"]}`}
            >
              <div
                className={` grid gap-2 ${base_styles} ${pageClasses["row-hover"]}`}
              >
                {columns.map((col, colIndex) => {
                  // Always map the value for this column id
                  const value = row[col.id];
                  return (
                    <span
                      key={col.id}
                      className={`${
                        pageClasses["row-text"]
                      } justify-start items-center flex ${
                        col.className
                      } text-xs ${
                        colIndex !== 0
                          ? `borde-r-l ${classes["border"]} pl--1`
                          : ""
                      } p-2 break-all`}
                    >
                      {col.render ? col.render(value, row, rowIndex) : value}
                    </span>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
      {/* Table Footer - Static */}
      {pagination && (
        <div
          className={`${classes.sports_page["card-bg"]} ${pageClasses["row-text"]} ${classes.sports_page["card-border"]}  px-4 py-2`}
        >
          <div className="flex flex-row justify-between items-center">
            <span
              className={`${pageClasses["card-text"]} font-semibold text-[11px]`}
            >
              Number of rows: {pagination?.perPage || 0}
            </span>

            {/* Pagination Controls */}
            <div className="flex flex-row items-center gap-4">
              <span
                className={`${pageClasses["card-text"]} font-semibold text-[11px]`}
              >
                Page {pagination?.currentPage || 0} of{" "}
                {pagination?.lastPage || 0}
              </span>

              <div className="flex flex-row items-center gap-2">
                {/* Previous Page Button */}
                <button
                  type="button"
                  onClick={pagination && (() => pagination.onPageChange(1))}
                  disabled={
                    !pagination ||
                    !pagination.prevPage ||
                    pagination.prevPage < 1
                  }
                  className={`p-1 h-7 w-7 flex justify-center items-center rounded ${
                    pageClasses["button-primary-bg"]
                  } ${
                    !pagination ||
                    !pagination.prevPage ||
                    pagination.prevPage < 1
                      ? `opacity-50 pointer-events-none text-gray-500`
                      : `${pageClasses["button-primary-bg"]} text-gray-300 ${pageClasses["button-primary-hover"]}`
                  }`}
                >
                  <BsChevronDoubleLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={
                    pagination &&
                    (() => pagination.onPageChange(pagination.currentPage - 1))
                  }
                  disabled={
                    !pagination ||
                    !pagination.prevPage ||
                    pagination.prevPage < 1
                  }
                  className={`p-1 h-7 w-7 flex justify-center items-center rounded ${
                    pageClasses["button-primary-bg"]
                  } ${
                    !pagination ||
                    !pagination.prevPage ||
                    pagination.prevPage < 1
                      ? `opacity-50 pointer-events-none text-gray-500`
                      : `${pageClasses["button-primary-bg"]} text-gray-300 ${pageClasses["button-primary-hover"]}`
                  }`}
                >
                  <BsChevronLeft size={18} />
                </button>

                {/* Next Page Button */}
                <button
                  type="button"
                  onClick={
                    pagination &&
                    (() => pagination.onPageChange(pagination.currentPage + 1))
                  }
                  disabled={
                    !pagination ||
                    !pagination.nextPage ||
                    pagination.nextPage < 1
                  }
                  className={`p-1 h-7 w-7 flex justify-center items-center rounded ${
                    pageClasses["button-primary-bg"]
                  } ${
                    !pagination ||
                    !pagination.nextPage ||
                    pagination.nextPage < 1
                      ? `opacity-50 pointer-events-none text-gray-500`
                      : `${pageClasses["button-primary-bg"]} text-gray-300 ${pageClasses["button-primary-hover"]}`
                  }`}
                >
                  <BsChevronRight size={18} />
                </button>
                <button
                  type="button"
                  onClick={
                    pagination &&
                    (() => pagination.onPageChange(pagination.lastPage))
                  }
                  disabled={
                    pagination.currentPage === pagination.lastPage ||
                    !pagination ||
                    !pagination.lastPage ||
                    pagination.lastPage <= 1
                  }
                  className={`p-1 h-7 w-7 flex justify-center items-center rounded ${
                    pageClasses["button-primary-bg"]
                  } ${
                    pagination.currentPage === pagination.lastPage ||
                    !pagination ||
                    !pagination.lastPage ||
                    pagination.lastPage <= 1
                      ? `opacity-50 pointer-events-none text-gray-500`
                      : `${pageClasses["button-primary-bg"]} text-gray-300 ${pageClasses["button-primary-hover"]}`
                  }`}
                >
                  <BsChevronDoubleRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaginatedTable;
