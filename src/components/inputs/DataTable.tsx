import React from "react";

interface Column {
  key: string;
  title: string;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (item: any, index: number) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  onRowPress?: (item: any, index: number) => void;
  className?: string;
  headerClassName?: string;
  rowClassName?: string;
}

export const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  onRowPress,
  className = "",
  headerClassName = "",
  rowClassName = "",
}) => {
  const renderCell = (item: any, column: Column, index: number) => {
    if (column.render) {
      return column.render(item, index);
    }

    return (
      <p
        className={`text-white text-sm ${
          column.align === "center"
            ? "text-center"
            : column.align === "right"
            ? "text-right"
            : "text-left"
        }`}
      >
        {item[column.key] || ""}
      </p>
    );
  };

  return (
    <div className={`bg-secondary h-full ${className}`}>
      <div
        className={`flex bg-primary border-b border-gray-600 ${headerClassName}`}
      >
        {columns.map((column, index) => (
          <div
            key={column.key}
            className={`p-2 ${column.width || "flex-1"} ${
              column.align === "center"
                ? "items-center"
                : column.align === "right"
                ? "items-end"
                : "items-start"
            }`}
          >
            <p className="text-white text-sm font-semibold whitespace-nowrap">
              {column.title}
            </p>
          </div>
        ))}
      </div>

      <div className="overflow-y-auto">
        {data.map((item, rowIndex) => (
          <button
            key={rowIndex}
            onClick={() => onRowPress?.(item, rowIndex)}
            className={`flex border-b items-center border-gray-700 p-0.5 px-1 w-full text-left hover:bg-gray-600 transition-colors ${
              rowIndex % 2 !== 0 ? "bg-primary" : ""
            } ${rowClassName}`}
          >
            {columns.map((column, colIndex) => (
              <div
                key={column.key}
                className={`p-0.5 py-2 ${column.width || "flex-1"} ${
                  column.align === "center"
                    ? "items-center"
                    : column.align === "right"
                    ? "items-end"
                    : "items-start"
                }`}
              >
                {renderCell(item, column, rowIndex)}
              </div>
            ))}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DataTable;
