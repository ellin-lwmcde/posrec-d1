import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DataTableColumn {
  key: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
}

export interface DataTableRow {
  id: string;
  data: Record<string, any>;
  children?: DataTableRow[];
  expandable?: boolean;
  className?: string;
}

interface DataTableProps {
  columns: DataTableColumn[];
  data: DataTableRow[];
  searchable?: boolean;
  searchPlaceholder?: string;
  onRowClick?: (row: DataTableRow) => void;
  className?: string;
}

export const DataTable = ({
  columns,
  data,
  searchable = true,
  searchPlaceholder = "Search...",
  onRowClick,
  className,
}: DataTableProps) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [expandedRows, setExpandedRows] = React.useState<Set<string>>(new Set());

  const toggleRow = (rowId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(rowId)) {
        newSet.delete(rowId);
      } else {
        newSet.add(rowId);
      }
      return newSet;
    });
  };

  const filteredData = React.useMemo(() => {
    if (!searchTerm) return data;
    
    return data.filter(row => 
      Object.values(row.data).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  const renderRow = (row: DataTableRow, level = 0) => (
    <React.Fragment key={row.id}>
      <TableRow 
        className={cn(
          "cursor-pointer hover:bg-muted/50",
          row.className
        )}
        onClick={() => onRowClick?.(row)}
      >
        {columns.map((column, index) => (
          <TableCell 
            key={column.key}
            className={cn(
              index === 0 && level > 0 && `pl-${4 + level * 4}`
            )}
          >
            {index === 0 && row.expandable && (
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 mr-2"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleRow(row.id);
                }}
              >
                {expandedRows.has(row.id) ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </Button>
            )}
            {row.data[column.key]}
          </TableCell>
        ))}
      </TableRow>
      
      {row.expandable && expandedRows.has(row.id) && row.children?.map(child => 
        renderRow(child, level + 1)
      )}
    </React.Fragment>
  );

  return (
    <div className={cn("space-y-4", className)}>
      {searchable && (
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      )}
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>{column.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map(row => renderRow(row))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};