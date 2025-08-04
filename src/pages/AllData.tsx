import { useState } from "react";
import { DataTable, DataTableColumn, DataTableRow } from "@/components/ui/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface DataItem {
  id: string;
  cusip: string;
  security: string;
  fund: string;
  dealer: string;
  internalPosition: number;
  externalPosition: number;
  status: "matched" | "unmatched" | "near_match";
  variance: number;
  securityType: string;
  lastUpdated: string;
}

const AllData = () => {
  const [selectedFund, setSelectedFund] = useState<string>("all");
  const [data] = useState<DataItem[]>([
    {
      id: "1",
      cusip: "912828XM5",
      security: "US Treasury Note 2.5% 2027",
      fund: "Fund A1",
      dealer: "Goldman Sachs",
      internalPosition: 1000000,
      externalPosition: 1000000,
      status: "matched",
      variance: 0,
      securityType: "Government Bond",
      lastUpdated: "2024-01-15"
    },
    {
      id: "2",
      cusip: "037833100",
      security: "Apple Inc Common Stock",
      fund: "Fund B2",
      dealer: "JP Morgan",
      internalPosition: 750000,
      externalPosition: 770000,
      status: "near_match",
      variance: 0.027,
      securityType: "Equity",
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
      status: "unmatched",
      variance: 1.0,
      securityType: "Equity",
      lastUpdated: "2024-01-14"
    },
    {
      id: "4",
      cusip: "79466L302",
      security: "Salesforce Inc Common Stock",
      fund: "Fund A1",
      dealer: "Merrill Lynch",
      internalPosition: 300000,
      externalPosition: 300000,
      status: "matched",
      variance: 0,
      securityType: "Equity",
      lastUpdated: "2024-01-14"
    },
    {
      id: "5",
      cusip: "46625H100",
      security: "JPMorgan Chase & Co",
      fund: "Fund B2",
      dealer: "Goldman Sachs",
      internalPosition: 425000,
      externalPosition: 400000,
      status: "near_match",
      variance: -0.059,
      securityType: "Equity",
      lastUpdated: "2024-01-13"
    }
  ]);

  const funds = ["all", ...Array.from(new Set(data.map(item => item.fund)))];
  const dealers = Array.from(new Set(data.map(item => item.dealer)));
  const securityTypes = Array.from(new Set(data.map(item => item.securityType)));

  const filteredData = selectedFund === "all" 
    ? data 
    : data.filter(item => item.fund === selectedFund);

  const getStatusColor = (status: DataItem["status"]) => {
    switch (status) {
      case "matched":
        return "bg-success/10 text-success";
      case "near_match":
        return "bg-warning/10 text-warning";
      case "unmatched":
        return "bg-error/10 text-error";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusLabel = (status: DataItem["status"]) => {
    switch (status) {
      case "matched":
        return "Matched";
      case "near_match":
        return "Near Match";
      case "unmatched":
        return "Unmatched";
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
    { key: "securityType", header: "Type" },
    { key: "internalPosition", header: "Internal Position" },
    { key: "externalPosition", header: "External Position" },
    { key: "variance", header: "Variance" },
    { key: "status", header: "Status" },
    { key: "lastUpdated", header: "Last Updated" }
  ];

  const tableData: DataTableRow[] = filteredData.map(item => ({
    id: item.id,
    data: {
      cusip: item.cusip,
      security: item.security,
      fund: item.fund,
      dealer: item.dealer,
      securityType: item.securityType,
      internalPosition: formatCurrency(item.internalPosition),
      externalPosition: formatCurrency(item.externalPosition),
      variance: (
        <span className={cn(
          "font-mono",
          item.variance > 0 ? "text-success" : item.variance < 0 ? "text-error" : "text-muted-foreground"
        )}>
          {formatPercentage(item.variance)}
        </span>
      ),
      status: (
        <Badge className={getStatusColor(item.status)}>
          {getStatusLabel(item.status)}
        </Badge>
      ),
      lastUpdated: item.lastUpdated
    }
  }));

  // Navigation pivot data
  const pivotData = {
    byFund: funds.slice(1).map(fund => ({
      name: fund,
      count: data.filter(item => item.fund === fund).length,
      matched: data.filter(item => item.fund === fund && item.status === "matched").length,
      unmatched: data.filter(item => item.fund === fund && item.status === "unmatched").length
    })),
    byDealer: dealers.map(dealer => ({
      name: dealer,
      count: data.filter(item => item.dealer === dealer).length,
      matched: data.filter(item => item.dealer === dealer && item.status === "matched").length,
      unmatched: data.filter(item => item.dealer === dealer && item.status === "unmatched").length
    })),
    byType: securityTypes.map(type => ({
      name: type,
      count: data.filter(item => item.securityType === type).length,
      matched: data.filter(item => item.securityType === type && item.status === "matched").length,
      unmatched: data.filter(item => item.securityType === type && item.status === "unmatched").length
    }))
  };

  return (
    <div className="grid grid-cols-12 gap-6 h-screen">
      {/* Navigation Pivot */}
      <div className="col-span-3">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-lg">Navigation Pivot</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">By Fund</h3>
                  <div className="space-y-2">
                    {pivotData.byFund.map(fund => (
                      <div 
                        key={fund.name}
                        className={cn(
                          "p-2 rounded cursor-pointer transition-colors",
                          selectedFund === fund.name ? "bg-primary/10 text-primary" : "hover:bg-muted"
                        )}
                        onClick={() => setSelectedFund(fund.name)}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{fund.name}</span>
                          <span className="text-xs text-muted-foreground">{fund.count}</span>
                        </div>
                        <div className="flex space-x-1 mt-1">
                          <div className="h-1 flex-1 bg-success rounded"></div>
                          <div className="h-1 flex-1 bg-error rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-3">By Dealer</h3>
                  <div className="space-y-2">
                    {pivotData.byDealer.map(dealer => (
                      <div key={dealer.name} className="p-2 rounded hover:bg-muted">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{dealer.name}</span>
                          <span className="text-xs text-muted-foreground">{dealer.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-3">By Security Type</h3>
                  <div className="space-y-2">
                    {pivotData.byType.map(type => (
                      <div key={type.name} className="p-2 rounded hover:bg-muted">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{type.name}</span>
                          <span className="text-xs text-muted-foreground">{type.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Main Data Grid */}
      <div className="col-span-9">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">All Data</h1>
              <p className="text-muted-foreground">
                Complete view of all position data with advanced filtering
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={selectedFund} onValueChange={setSelectedFund}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by fund" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Funds</SelectItem>
                  {funds.slice(1).map(fund => (
                    <SelectItem key={fund} value={fund}>{fund}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card>
            <CardContent className="p-6">
              <DataTable
                columns={columns}
                data={tableData}
                searchPlaceholder="Search by CUSIP, security, fund, or dealer..."
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AllData;