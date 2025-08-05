import { useState, useMemo } from "react";
import { DataTable, DataTableColumn, DataTableRow } from "@/components/ui/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ExceptionItem {
  id: string;
  primeBroker: string;
  runDate: string;
  internalFund: string;
  externalFund: string;
  internalCusip: string;
  externalCusip: string;
  type: "NOT_MATCH_QTY" | "NEAR_MATCH_QTY" | "NOT_MATCH_INTERNAL" | "NOT_MATCH_EXTERNAL";
  brokerQty: number;
  ellinQty: number;
  delta: number;
  subTypes?: ExceptionItem[];
}

const Exceptions = () => {
  const [exceptions] = useState<ExceptionItem[]>([
    {
      id: "1",
      primeBroker: "Goldman Sachs",
      runDate: "2024-01-15",
      internalFund: "Fund A1",
      externalFund: "Fund A1",
      internalCusip: "912828XM5",
      externalCusip: "912828XM5",
      type: "NOT_MATCH_QTY",
      brokerQty: 950000,
      ellinQty: 1000000,
      delta: 50000,
      subTypes: [
        {
          id: "1a",
          primeBroker: "Goldman Sachs",
          runDate: "2024-01-15",
          internalFund: "Fund A1",
          externalFund: "Fund A1",
          internalCusip: "912828XM5",
          externalCusip: "912828XM5",
          type: "NOT_MATCH_QTY",
          brokerQty: 475000,
          ellinQty: 500000,
          delta: 25000
        },
        {
          id: "1b",
          primeBroker: "Goldman Sachs", 
          runDate: "2024-01-15",
          internalFund: "Fund A1",
          externalFund: "Fund A1",
          internalCusip: "912828XM5",
          externalCusip: "912828XM5",
          type: "NOT_MATCH_QTY",
          brokerQty: 475000,
          ellinQty: 500000,
          delta: 25000
        }
      ]
    },
    {
      id: "2",
      primeBroker: "JP Morgan",
      runDate: "2024-01-15",
      internalFund: "Fund B2",
      externalFund: "Fund B2",
      internalCusip: "037833100",
      externalCusip: "037833100",
      type: "NEAR_MATCH_QTY",
      brokerQty: 770000,
      ellinQty: 750000,
      delta: -20000
    },
    {
      id: "3",
      primeBroker: "Morgan Stanley",
      runDate: "2024-01-14",
      internalFund: "Fund C3",
      externalFund: "Fund C3",
      internalCusip: "594918104",
      externalCusip: "594918104",
      type: "NOT_MATCH_INTERNAL",
      brokerQty: 500000,
      ellinQty: 0,
      delta: -500000
    },
    {
      id: "4",
      primeBroker: "Merrill Lynch",
      runDate: "2024-01-14",
      internalFund: "Fund D4",
      externalFund: "Fund D4",
      internalCusip: "79466L302",
      externalCusip: "79466L302",
      type: "NOT_MATCH_EXTERNAL",
      brokerQty: 0,
      ellinQty: 300000,
      delta: 300000
    },
    {
      id: "5",
      primeBroker: "Credit Suisse",
      runDate: "2024-01-15",
      internalFund: "Fund E5",
      externalFund: "Fund E5",
      internalCusip: "88160R101",
      externalCusip: "88160R101",
      type: "NOT_MATCH_QTY",
      brokerQty: 1200000,
      ellinQty: 1180000,
      delta: -20000
    },
    {
      id: "6",
      primeBroker: "Deutsche Bank",
      runDate: "2024-01-15",
      internalFund: "Fund F6",
      externalFund: "Fund F6",
      internalCusip: "369604103",
      externalCusip: "369604103",
      type: "NEAR_MATCH_QTY",
      brokerQty: 850000,
      ellinQty: 875000,
      delta: 25000
    },
    {
      id: "7",
      primeBroker: "Barclays",
      runDate: "2024-01-14",
      internalFund: "Fund G7",
      externalFund: "Fund G7",
      internalCusip: "254687106",
      externalCusip: "254687106",
      type: "NOT_MATCH_INTERNAL",
      brokerQty: 320000,
      ellinQty: 0,
      delta: -320000
    },
    {
      id: "8",
      primeBroker: "UBS",
      runDate: "2024-01-14",
      internalFund: "Fund H8",
      externalFund: "Fund H8",
      internalCusip: "68389X105",
      externalCusip: "68389X105",
      type: "NOT_MATCH_EXTERNAL",
      brokerQty: 0,
      ellinQty: 450000,
      delta: 450000
    },
    {
      id: "9",
      primeBroker: "Citigroup",
      runDate: "2024-01-15",
      internalFund: "Fund I9",
      externalFund: "Fund I9",
      internalCusip: "717081103",
      externalCusip: "717081103",
      type: "NOT_MATCH_QTY",
      brokerQty: 2100000,
      ellinQty: 2050000,
      delta: -50000
    },
    {
      id: "10",
      primeBroker: "Wells Fargo",
      runDate: "2024-01-15",
      internalFund: "Fund J10",
      externalFund: "Fund J10",
      internalCusip: "931142103",
      externalCusip: "931142103",
      type: "NEAR_MATCH_QTY",
      brokerQty: 680000,
      ellinQty: 695000,
      delta: 15000
    }
  ]);

  const getExceptionColor = (type: ExceptionItem["type"]) => {
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

  const getExceptionLabel = (type: ExceptionItem["type"]) => {
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

  const formatNumber = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDelta = (value: number) => {
    const formatted = formatNumber(Math.abs(value));
    return value > 0 ? `+${formatted}` : value < 0 ? `-${formatted}` : formatted;
  };

  const columns: DataTableColumn[] = [
    { key: "primeBroker", header: "Prime Broker" },
    { key: "runDate", header: "Run Date" },
    { key: "internalFund", header: "Internal Fund" },
    { key: "externalFund", header: "External Fund" },
    { key: "internalCusip", header: "Internal CUSIP" },
    { key: "externalCusip", header: "External CUSIP" },
    { key: "type", header: "Type" },
    { key: "brokerQty", header: "Broker Qty" },
    { key: "ellinQty", header: "Ellin Qty" },
    { key: "delta", header: "Delta" }
  ];

  const tableData: DataTableRow[] = exceptions.map(exception => ({
    id: exception.id,
    expandable: !!exception.subTypes?.length,
    className: cn(
      "border-l-4",
      exception.type === "NOT_MATCH_QTY" && "border-l-exception-not-match-qty",
      exception.type === "NEAR_MATCH_QTY" && "border-l-exception-near-match-qty", 
      exception.type === "NOT_MATCH_INTERNAL" && "border-l-exception-not-match-internal",
      exception.type === "NOT_MATCH_EXTERNAL" && "border-l-exception-not-match-external"
    ),
    data: {
      primeBroker: exception.primeBroker,
      runDate: exception.runDate,
      internalFund: exception.internalFund,
      externalFund: exception.externalFund,
      internalCusip: exception.internalCusip,
      externalCusip: exception.externalCusip,
      type: (
        <Badge className={getExceptionColor(exception.type)}>
          {getExceptionLabel(exception.type)}
        </Badge>
      ),
      brokerQty: formatNumber(exception.brokerQty),
      ellinQty: formatNumber(exception.ellinQty),
      delta: (
        <span className={cn(
          "font-mono font-semibold",
          exception.delta > 0 ? "text-success" : exception.delta < 0 ? "text-error" : "text-muted-foreground"
        )}>
          {formatDelta(exception.delta)}
        </span>
      )
    },
    children: exception.subTypes?.map(subType => ({
      id: subType.id,
      data: {
        primeBroker: subType.primeBroker,
        runDate: subType.runDate,
        internalFund: subType.internalFund,
        externalFund: subType.externalFund,
        internalCusip: subType.internalCusip,
        externalCusip: subType.externalCusip,
        type: (
          <Badge className={getExceptionColor(subType.type)}>
            {getExceptionLabel(subType.type)}
          </Badge>
        ),
        brokerQty: formatNumber(subType.brokerQty),
        ellinQty: formatNumber(subType.ellinQty),
        delta: (
          <span className={cn(
            "font-mono font-semibold",
            subType.delta > 0 ? "text-success" : subType.delta < 0 ? "text-error" : "text-muted-foreground"
          )}>
            {formatDelta(subType.delta)}
          </span>
        )
      }
    }))
  }));

  const exceptionStats = useMemo(() => {
    const stats = {
      total: exceptions.length,
      notMatchQty: exceptions.filter(e => e.type === "NOT_MATCH_QTY").length,
      nearMatchQty: exceptions.filter(e => e.type === "NEAR_MATCH_QTY").length,
      notMatchInternal: exceptions.filter(e => e.type === "NOT_MATCH_INTERNAL").length,
      notMatchExternal: exceptions.filter(e => e.type === "NOT_MATCH_EXTERNAL").length,
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

      <div className="bg-background border rounded-lg">
        <div className="border-b p-4">
          <h3 className="text-lg font-semibold">Exception Details</h3>
        </div>
        <DataTable
          columns={columns}
          data={tableData}
          searchPlaceholder="Search exceptions by broker, fund, CUSIP, or type..."
          className="excel-grid"
        />
      </div>
    </div>
  );
};

export default Exceptions;