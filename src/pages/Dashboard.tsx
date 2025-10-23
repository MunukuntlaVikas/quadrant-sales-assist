import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, TrendingUp, Phone, DollarSign, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const kpis = [
    {
      title: "Active Leads",
      value: "127",
      change: "+12%",
      icon: Target,
      trend: "up",
    },
    {
      title: "Calls Today",
      value: "34",
      change: "+5",
      icon: Phone,
      trend: "up",
    },
    {
      title: "Pipeline Value",
      value: "$2.4M",
      change: "+18%",
      icon: DollarSign,
      trend: "up",
    },
    {
      title: "Conversion Rate",
      value: "24%",
      change: "+3%",
      icon: TrendingUp,
      trend: "up",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's your sales overview.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-success">{kpi.change}</span> from last week
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Button asChild className="h-24 flex-col gap-2">
              <Link to="/hunt">
                <Target className="h-6 w-6" />
                <span>Hunt Projects</span>
              </Link>
            </Button>
            <Button asChild variant="secondary" className="h-24 flex-col gap-2">
              <Link to="/analysis">
                <TrendingUp className="h-6 w-6" />
                <span>Analyze Company</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-24 flex-col gap-2">
              <Link to="/conversations">
                <Phone className="h-6 w-6" />
                <span>Start Call</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-24 flex-col gap-2">
              <Link to="/bookmarks">
                <ArrowUpRight className="h-6 w-6" />
                <span>View Bookmarks</span>
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <div className="flex-1">
                    <p className="font-medium">New lead added</p>
                    <p className="text-xs text-muted-foreground">{i}h ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
