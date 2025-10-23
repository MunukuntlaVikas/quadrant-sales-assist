import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, BarChart3, Bookmark } from "lucide-react";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

const analysisSchema = z.object({
  company_name: z.string().min(2, "Company name must be at least 2 characters"),
  location: z.string().optional(),
  industry: z.string().optional(),
});

type AnalysisFormValues = z.infer<typeof analysisSchema>;

export default function CompanyAnalysis() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const form = useForm<AnalysisFormValues>({
    resolver: zodResolver(analysisSchema),
    defaultValues: {
      company_name: "",
      location: "",
      industry: "",
    },
  });

  const onSubmit = async (data: AnalysisFormValues) => {
    setIsLoading(true);
    try {
      const response = await apiClient.analyzeCompany(data);
      setResult(response);
      toast({
        title: "Success",
        description: "Company analysis completed",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to analyze company",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookmark = async () => {
    if (!result) return;
    
    try {
      await apiClient.addAnalysisBookmark({
        company_name: result.company_name,
        industry: result.industry,
        location: result.location,
        full_report_content: result.readiness_analysis,
        added_by: "Sales Rep",
        reason: "Promising company for outreach",
      });
      
      toast({
        title: "Bookmarked",
        description: "Analysis saved to bookmarks",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to bookmark",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Company Analysis</h1>
        <p className="text-muted-foreground">
          Analyze company readiness and potential for solutions
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analysis Parameters
            </CardTitle>
            <CardDescription>
              Enter company details for AI-powered readiness analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="company_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Acme Corp" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Healthcare, Finance" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., USA, Europe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Analyze Company
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Analysis Results</CardTitle>
                <CardDescription>Company readiness report</CardDescription>
              </div>
              <Button variant="outline" size="icon" onClick={handleBookmark}>
                <Bookmark className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-semibold">Company:</span> {result.company_name}
                </div>
                {result.industry && (
                  <div>
                    <span className="font-semibold">Industry:</span> {result.industry}
                  </div>
                )}
                {result.location && (
                  <div>
                    <span className="font-semibold">Location:</span> {result.location}
                  </div>
                )}
                <div className="mt-4">
                  <span className="font-semibold">Analysis:</span>
                  <Textarea
                    value={result.readiness_analysis}
                    readOnly
                    className="mt-2 min-h-[400px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
