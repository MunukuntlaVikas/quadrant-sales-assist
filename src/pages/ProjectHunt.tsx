import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Target, Bookmark } from "lucide-react";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

const huntSchema = z.object({
  domain_focus: z.string().min(2, "Domain focus must be at least 2 characters"),
  location: z.string().optional(),
  industry: z.string().optional(),
});

type HuntFormValues = z.infer<typeof huntSchema>;

export default function ProjectHunt() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const form = useForm<HuntFormValues>({
    resolver: zodResolver(huntSchema),
    defaultValues: {
      domain_focus: "",
      location: "",
      industry: "",
    },
  });

  const onSubmit = async (data: HuntFormValues) => {
    setIsLoading(true);
    try {
      const response = await apiClient.huntProjects(data);
      setResult(response);
      toast({
        title: "Success",
        description: "Project opportunities found successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to hunt projects",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookmark = async () => {
    if (!result) return;
    
    try {
      await apiClient.addHuntBookmark({
        company_name: result.domain_focus || "Unknown",
        domain_focus: result.domain_focus,
        industry: result.industry,
        location: result.location,
        full_report_content: result.opportunities_report,
        added_by: "Sales Rep",
        reason: "Interesting opportunities found",
      });
      
      toast({
        title: "Bookmarked",
        description: "Report saved to bookmarks",
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
        <h1 className="text-3xl font-bold tracking-tight">Project Hunt</h1>
        <p className="text-muted-foreground">
          Find active project opportunities and sales leads using AI
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Hunt Parameters
            </CardTitle>
            <CardDescription>
              Enter details to discover relevant project opportunities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="domain_focus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Domain Focus *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Cloud Computing, AI/ML" {...field} />
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
                        <Input placeholder="e.g., USA, Europe, Global" {...field} />
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
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Hunt Opportunities
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Opportunities Found</CardTitle>
                <CardDescription>AI-generated opportunity report</CardDescription>
              </div>
              <Button variant="outline" size="icon" onClick={handleBookmark}>
                <Bookmark className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-semibold">Domain:</span> {result.domain_focus}
                </div>
                {result.location && (
                  <div>
                    <span className="font-semibold">Location:</span> {result.location}
                  </div>
                )}
                {result.industry && (
                  <div>
                    <span className="font-semibold">Industry:</span> {result.industry}
                  </div>
                )}
                <div className="mt-4">
                  <span className="font-semibold">Report:</span>
                  <Textarea
                    value={result.opportunities_report}
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
