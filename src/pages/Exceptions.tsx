import { useState, useMemo } from "react";
import { DataTable, DataTableColumn, DataTableRow } from "@/components/ui/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ExceptionItem {
  id: string;
  primeBroker: string;
  runDate: string;
  fund: string;
  cusip: string;
  secnum: string;
  type: "CMO" | "Equity" | "Treasury" | "Corporate Bond" | "Municipal Bond";
  matchStatus: "NOT_MATCH_QTY" | "NEAR_MATCH_QTY" | "NOT_MATCH_INTERNAL" | "NOT_MATCH_EXTERNAL";
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
      fund: "Fund A1",
      cusip: "218DSK472M",
      secnum: "GMMAR 2007-TL7 4A12",
      type: "CMO",
      matchStatus: "NOT_MATCH_QTY",
      brokerQty: 950000,
      ellinQty: 1000000,
      delta: 50000,
      subTypes: [
        {
          id: "1a",
          primeBroker: "Goldman Sachs",
          runDate: "2024-01-15",
          fund: "Fund A1",
          cusip: "218DSK472M",
          secnum: "GMMAR 2007-TL7 4A12",
          type: "CMO",
          matchStatus: "NOT_MATCH_QTY",
          brokerQty: 475000,
          ellinQty: 500000,
          delta: 25000
        },
        {
          id: "1b",
          primeBroker: "Goldman Sachs", 
          runDate: "2024-01-15",
          fund: "Fund A1",
          cusip: "218DSK472M",
          secnum: "GMMAR 2007-TL7 4A12",
          type: "CMO",
          matchStatus: "NOT_MATCH_QTY",
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
      fund: "Fund B2",
      cusip: "037833100K",
      secnum: "APPLE 2024-EQ3 7B89",
      type: "Equity",
      matchStatus: "NEAR_MATCH_QTY",
      brokerQty: 770000,
      ellinQty: 750000,
      delta: -20000
    },
    {
      id: "3",
      primeBroker: "Morgan Stanley",
      runDate: "2024-01-14",
      fund: "Fund C3",
      cusip: "594918104L",
      secnum: "MSFT 2023-DB2 1C45",
      type: "Corporate Bond",
      matchStatus: "NOT_MATCH_INTERNAL",
      brokerQty: 500000,
      ellinQty: 0,
      delta: -500000
    },
    {
      id: "4",
      primeBroker: "Merrill Lynch",
      runDate: "2024-01-14",
      fund: "Fund D4",
      cusip: "79466L302N",
      secnum: "SFDC 2025-CL8 9D12",
      type: "Treasury",
      matchStatus: "NOT_MATCH_EXTERNAL",
      brokerQty: 0,
      ellinQty: 300000,
      delta: 300000
    },
    {
      id: "5",
      primeBroker: "Credit Suisse",
      runDate: "2024-01-15",
      fund: "Fund E5",
      cusip: "88160R101P",
      secnum: "TESLA 2022-MT5 6E78",
      type: "Equity",
      matchStatus: "NOT_MATCH_QTY",
      brokerQty: 1200000,
      ellinQty: 1180000,
      delta: -20000
    },
    {
      id: "6",
      primeBroker: "Deutsche Bank",
      runDate: "2024-01-15",
      fund: "Fund F6",
      cusip: "369604103R",
      secnum: "GENL 2021-FN7 2A34",
      type: "Municipal Bond",
      matchStatus: "NEAR_MATCH_QTY",
      brokerQty: 850000,
      ellinQty: 875000,
      delta: 25000
    },
    {
      id: "7",
      primeBroker: "Barclays",
      runDate: "2024-01-14",
      fund: "Fund G7",
      cusip: "254687106S",
      secnum: "NVDA 2023-AI4 8F90",
      type: "Equity",
      matchStatus: "NOT_MATCH_INTERNAL",
      brokerQty: 320000,
      ellinQty: 0,
      delta: -320000
    },
    {
      id: "8",
      primeBroker: "UBS",
      runDate: "2024-01-14",
      fund: "Fund H8",
      cusip: "68389X105T",
      secnum: "ORACLE 2020-SW3 5G67",
      type: "Corporate Bond",
      matchStatus: "NOT_MATCH_EXTERNAL",
      brokerQty: 0,
      ellinQty: 450000,
      delta: 450000
    },
    {
      id: "9",
      primeBroker: "Citigroup",
      runDate: "2024-01-15",
      fund: "Fund I9",
      cusip: "717081103U",
      secnum: "PEPSI 2024-CV9 3H23",
      type: "CMO",
      matchStatus: "NOT_MATCH_QTY",
      brokerQty: 2100000,
      ellinQty: 2050000,
      delta: -50000
    },
    {
      id: "10",
      primeBroker: "Wells Fargo",
      runDate: "2024-01-15",
      fund: "Fund J10",
      cusip: "931142103V",
      secnum: "WMT 2025-RT1 7I56",
      type: "Treasury",
      matchStatus: "NEAR_MATCH_QTY",
      brokerQty: 680000,
      ellinQty: 695000,
      delta: 15000
    }
  ]);

  const getExceptionColor = (matchStatus: ExceptionItem["matchStatus"]) => {
    switch (matchStatus) {
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

  const getExceptionLabel = (matchStatus: ExceptionItem["matchStatus"]) => {
    switch (matchStatus) {
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
    { key: "fund", header: "Fund" },
    { key: "cusip", header: "CUSIP" },
    { key: "secnum", header: "Secnum" },
    { key: "type", header: "Type" },
    { key: "brokerQty", header: "Broker Qty" },
    { key: "ellinQty", header: "Ellin Qty" },
    { key: "delta", header: "Delta" },
    { key: "matchStatus", header: "Match Status" }
  ];

  const tableData: DataTableRow[] = exceptions.map(exception => ({
    id: exception.id,
    expandable: !!exception.subTypes?.length,
    className: cn(
      "border-l-4",
      exception.matchStatus === "NOT_MATCH_QTY" && "border-l-exception-not-match-qty",
      exception.matchStatus === "NEAR_MATCH_QTY" && "border-l-exception-near-match-qty", 
      exception.matchStatus === "NOT_MATCH_INTERNAL" && "border-l-exception-not-match-internal",
      exception.matchStatus === "NOT_MATCH_EXTERNAL" && "border-l-exception-not-match-external"
    ),
    data: {
      primeBroker: exception.primeBroker,
      runDate: exception.runDate,
      fund: exception.fund,
      cusip: exception.cusip,
      secnum: exception.secnum,
      type: exception.type,
      brokerQty: formatNumber(exception.brokerQty),
      ellinQty: formatNumber(exception.ellinQty),
      delta: (
        <span className={cn(
          "font-mono font-semibold",
          exception.delta > 0 ? "text-success" : exception.delta < 0 ? "text-error" : "text-muted-foreground"
        )}>
          {formatDelta(exception.delta)}
        </span>
      ),
      matchStatus: (
        <Badge className={getExceptionColor(exception.matchStatus)}>
          {getExceptionLabel(exception.matchStatus)}
        </Badge>
      )
    },
    children: exception.subTypes?.map(subType => ({
      id: subType.id,
      data: {
        primeBroker: subType.primeBroker,
        runDate: subType.runDate,
        fund: subType.fund,
        cusip: subType.cusip,
        secnum: subType.secnum,
        type: subType.type,
        brokerQty: formatNumber(subType.brokerQty),
        ellinQty: formatNumber(subType.ellinQty),
        delta: (
          <span className={cn(
            "font-mono font-semibold",
            subType.delta > 0 ? "text-success" : subType.delta < 0 ? "text-error" : "text-muted-foreground"
          )}>
            {formatDelta(subType.delta)}
          </span>
        ),
        matchStatus: (
          <Badge className={getExceptionColor(subType.matchStatus)}>
            {getExceptionLabel(subType.matchStatus)}
          </Badge>
        )
      }
    }))
  }));

  const exceptionStats = useMemo(() => {
    const stats = {
      total: exceptions.length,
      notMatchQty: exceptions.filter(e => e.matchStatus === "NOT_MATCH_QTY").length,
      nearMatchQty: exceptions.filter(e => e.matchStatus === "NEAR_MATCH_QTY").length,
      notMatchInternal: exceptions.filter(e => e.matchStatus === "NOT_MATCH_INTERNAL").length,
      notMatchExternal: exceptions.filter(e => e.matchStatus === "NOT_MATCH_EXTERNAL").length,
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