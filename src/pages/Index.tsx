import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertTriangle, CheckCircle, Users } from "lucide-react";

const Index = () => {
  const dashboardStats = {
    totalPositions: 1247,
    activeExceptions: 23,
    matchedPositions: 1189,
    activeDealers: 8
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Asset Holdings Comparison Dashboard
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Monitor and reconcile position data between internal systems and external dealers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Positions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalPositions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across all funds and dealers
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-error">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Exceptions</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-error">{dashboardStats.activeExceptions}</div>
            <p className="text-xs text-muted-foreground">
              Requiring immediate attention
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-success">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Matched Positions</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{dashboardStats.matchedPositions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              95.3% match rate
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-info">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Dealers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-info">{dashboardStats.activeDealers}</div>
            <p className="text-xs text-muted-foreground">
              Connected and reporting
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Exception Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">CUSIP: 912828XM5</p>
                  <p className="text-sm text-muted-foreground">US Treasury Note - Fund A1</p>
                </div>
                <Badge className="bg-error/10 text-error">Quantity Mismatch</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">CUSIP: 037833100</p>
                  <p className="text-sm text-muted-foreground">Apple Inc - Fund B2</p>
                </div>
                <Badge className="bg-warning/10 text-warning">Near Match</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">CUSIP: 594918104</p>
                  <p className="text-sm text-muted-foreground">Microsoft Corp - Fund C3</p>
                </div>
                <Badge className="bg-exception-not-match-internal/10 text-exception-not-match-internal">Missing Internal</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Data Synchronization</span>
                <Badge className="bg-success/10 text-success">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Mapping Engine</span>
                <Badge className="bg-success/10 text-success">Running</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Rule Processing</span>
                <Badge className="bg-success/10 text-success">Operational</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Last Update</span>
                <span className="text-sm text-muted-foreground">2 minutes ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
