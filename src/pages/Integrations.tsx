import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, RefreshCw, Boxes } from "lucide-react";

export default function Integrations() {
  const integrations = [
    {
      name: "Gemini AI",
      description: "AI-powered analysis and opportunity hunting",
      status: "active",
      lastSync: "2 minutes ago",
    },
    {
      name: "Microsoft Graph",
      description: "Email sending and calendar integration",
      status: "active",
      lastSync: "5 minutes ago",
    },
    {
      name: "Apollo Agent",
      description: "Lead enrichment and contact discovery",
      status: "pending",
      lastSync: "Never",
    },
    {
      name: "Cerebricks",
      description: "Data integration and analytics",
      status: "pending",
      lastSync: "Never",
    },
    {
      name: "Kaveri",
      description: "CRM synchronization",
      status: "pending",
      lastSync: "Never",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
        <p className="text-muted-foreground">
          Manage third-party integrations and data sources
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {integrations.map((integration) => (
          <Card key={integration.name}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Boxes className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{integration.name}</CardTitle>
                </div>
                <Badge
                  variant={integration.status === 'active' ? 'default' : 'secondary'}
                  className="gap-1"
                >
                  {integration.status === 'active' ? (
                    <CheckCircle2 className="h-3 w-3" />
                  ) : (
                    <AlertCircle className="h-3 w-3" />
                  )}
                  {integration.status}
                </Badge>
              </div>
              <CardDescription>{integration.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  Last sync: {integration.lastSync}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sync
                  </Button>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
