import { useState, useMemo } from "react";
import { DataTable, DataTableColumn, DataTableRow } from "@/components/ui/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ExceptionItem {
  id: string;
  cusip: string;
  security: string;
  fund: string;
  dealer: string;
  internalPosition: number;
  externalPosition: number;
  variance: number;
  exceptionType: "NOT_MATCH_QTY" | "NEAR_MATCH_QTY" | "NOT_MATCH_INTERNAL" | "NOT_MATCH_EXTERNAL";
  lastUpdated: string;
  subTypes?: ExceptionItem[];
}

const Exceptions = () => {
  const [exceptions] = useState<ExceptionItem[]>([
    {
      id: "1",
      cusip: "912828XM5",
      security: "US Treasury Note 2.5% 2027",
      fund: "Fund A1",
      dealer: "Goldman Sachs",
      internalPosition: 1000000,
      externalPosition: 950000,
      variance: -0.05,
      exceptionType: "NOT_MATCH_QTY",
      lastUpdated: "2024-01-15",
      subTypes: [
        {
          id: "1a",
          cusip: "912828XM5",
          security: "US Treasury Note 2.5% 2027 - Lot A",
          fund: "Fund A1",
          dealer: "Goldman Sachs",
          internalPosition: 500000,
          externalPosition: 475000,
          variance: -0.05,
          exceptionType: "NOT_MATCH_QTY",
          lastUpdated: "2024-01-15"
        },
        {
          id: "1b",
          cusip: "912828XM5",
          security: "US Treasury Note 2.5% 2027 - Lot B",
          fund: "Fund A1",
          dealer: "Goldman Sachs",
          internalPosition: 500000,
          externalPosition: 475000,
          variance: -0.05,
          exceptionType: "NOT_MATCH_QTY",
          lastUpdated: "2024-01-15"
        }
      ]
    },
    {
      id: "2",
      cusip: "037833100",
      security: "Apple Inc Common Stock",
      fund: "Fund B2",
      dealer: "JP Morgan",
      internalPosition: 750000,
      externalPosition: 770000,
      variance: 0.027,
      exceptionType: "NEAR_MATCH_QTY",
      lastUpdated: "2024-01-15"
    },
    {
      id: "3",
      cusip: "594918104",
      security: "Microsoft Corp Common Stock",
      fund: "Fund C3",
      dealer: "Morgan Stanley",
      internalPosition: 0,
      externalPosition: 500000,
      variance: 1.0,
      exceptionType: "NOT_MATCH_INTERNAL",
      lastUpdated: "2024-01-14"
    },
    {
      id: "4",
      cusip: "79466L302",
      security: "Salesforce Inc Common Stock",
      fund: "Fund D4",
      dealer: "Merrill Lynch",
      internalPosition: 300000,
      externalPosition: 0,
      variance: -1.0,
      exceptionType: "NOT_MATCH_EXTERNAL",
      lastUpdated: "2024-01-14"
    }
  ]);

  const getExceptionColor = (type: ExceptionItem["exceptionType"]) => {
    switch (type) {
      case "NOT_MATCH_QTY":
        return "bg-exception-not-match-qty text-white";
      case "NEAR_MATCH_QTY":
        return "bg-exception-near-match-qty text-white";
      case "NOT_MATCH_INTERNAL":
        return "bg-exception-not-match-internal text-white";
      case "NOT_MATCH_EXTERNAL":
        return "bg-exception-not-match-external text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getExceptionLabel = (type: ExceptionItem["exceptionType"]) => {
    switch (type) {
      case "NOT_MATCH_QTY":
        return "Quantity Mismatch";
      case "NEAR_MATCH_QTY":
        return "Near Match";
      case "NOT_MATCH_INTERNAL":
        return "Missing Internal";
      case "NOT_MATCH_EXTERNAL":
        return "Missing External";
      default:
        return "Unknown";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  const columns: DataTableColumn[] = [
    { key: "cusip", header: "CUSIP" },
    { key: "security", header: "Security" },
    { key: "fund", header: "Fund" },
    { key: "dealer", header: "Dealer" },
    { key: "internalPosition", header: "Internal Position" },
    { key: "externalPosition", header: "External Position" },
    { key: "variance", header: "Variance" },
    { key: "exceptionType", header: "Exception Type" },
    { key: "lastUpdated", header: "Last Updated" }
  ];

  const tableData: DataTableRow[] = exceptions.map(exception => ({
    id: exception.id,
    expandable: !!exception.subTypes?.length,
    className: cn(
      "border-l-4",
      exception.exceptionType === "NOT_MATCH_QTY" && "border-l-exception-not-match-qty",
      exception.exceptionType === "NEAR_MATCH_QTY" && "border-l-exception-near-match-qty", 
      exception.exceptionType === "NOT_MATCH_INTERNAL" && "border-l-exception-not-match-internal",
      exception.exceptionType === "NOT_MATCH_EXTERNAL" && "border-l-exception-not-match-external"
    ),
    data: {
      cusip: exception.cusip,
      security: exception.security,
      fund: exception.fund,
      dealer: exception.dealer,
      internalPosition: formatCurrency(exception.internalPosition),
      externalPosition: formatCurrency(exception.externalPosition),
      variance: (
        <span className={cn(
          "font-mono",
          exception.variance > 0 ? "text-success" : "text-error"
        )}>
          {formatPercentage(exception.variance)}
        </span>
      ),
      exceptionType: (
        <Badge className={getExceptionColor(exception.exceptionType)}>
          {getExceptionLabel(exception.exceptionType)}
        </Badge>
      ),
      lastUpdated: exception.lastUpdated
    },
    children: exception.subTypes?.map(subType => ({
      id: subType.id,
      data: {
        cusip: subType.cusip,
        security: subType.security,
        fund: subType.fund,
        dealer: subType.dealer,
        internalPosition: formatCurrency(subType.internalPosition),
        externalPosition: formatCurrency(subType.externalPosition),
        variance: (
          <span className={cn(
            "font-mono",
            subType.variance > 0 ? "text-success" : "text-error"
          )}>
            {formatPercentage(subType.variance)}
          </span>
        ),
        exceptionType: (
          <Badge className={getExceptionColor(subType.exceptionType)}>
            {getExceptionLabel(subType.exceptionType)}
          </Badge>
        ),
        lastUpdated: subType.lastUpdated
      }
    }))
  }));

  const exceptionStats = useMemo(() => {
    const stats = {
      total: exceptions.length,
      notMatchQty: exceptions.filter(e => e.exceptionType === "NOT_MATCH_QTY").length,
      nearMatchQty: exceptions.filter(e => e.exceptionType === "NEAR_MATCH_QTY").length,
      notMatchInternal: exceptions.filter(e => e.exceptionType === "NOT_MATCH_INTERNAL").length,
      notMatchExternal: exceptions.filter(e => e.exceptionType === "NOT_MATCH_EXTERNAL").length,
    };
    return stats;
  }, [exceptions]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Exceptions Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor and analyze position mismatches and data inconsistencies
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Exceptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exceptionStats.total}</div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-exception-not-match-qty">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Quantity Mismatch</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-exception-not-match-qty">
              {exceptionStats.notMatchQty}
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-exception-near-match-qty">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Near Match</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-exception-near-match-qty">
              {exceptionStats.nearMatchQty}
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-exception-not-match-internal">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Missing Internal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-exception-not-match-internal">
              {exceptionStats.notMatchInternal}
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-exception-not-match-external">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Missing External</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-exception-not-match-external">
              {exceptionStats.notMatchExternal}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exception Details</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={tableData}
            searchPlaceholder="Search exceptions by CUSIP, security, fund, or dealer..."
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Exceptions;