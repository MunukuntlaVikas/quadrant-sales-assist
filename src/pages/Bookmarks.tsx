import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Download, Trash2, FileText } from "lucide-react";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      const response: any = await apiClient.getEnhancedBookmarks();
      setBookmarks(response.bookmarks || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load bookmarks",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (id: number, reportType: string, companyName: string) => {
    try {
      const blob = reportType === 'hunt' 
        ? await apiClient.downloadHuntReport(id)
        : await apiClient.downloadAnalysisReport(id);
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${companyName}_${reportType}_report.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Downloaded",
        description: "Report downloaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to download report",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await apiClient.deleteEnhancedBookmark(id);
      setBookmarks(bookmarks.filter(b => b.id !== id));
      toast({
        title: "Deleted",
        description: "Bookmark removed successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete bookmark",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bookmarks</h1>
        <p className="text-muted-foreground">
          Saved reports and analyses ({bookmarks.length})
        </p>
      </div>

      {bookmarks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No bookmarks yet</p>
            <p className="text-sm text-muted-foreground">
              Bookmark reports from Hunt or Analysis pages
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {bookmarks.map((bookmark) => (
            <Card key={bookmark.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{bookmark.company_name}</CardTitle>
                    <CardDescription className="mt-1">
                      {bookmark.domain_focus || bookmark.industry || 'Analysis'}
                    </CardDescription>
                  </div>
                  <Badge variant={bookmark.report_type === 'hunt' ? 'default' : 'secondary'}>
                    {bookmark.report_type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bookmark.location && (
                    <p className="text-sm text-muted-foreground">
                      📍 {bookmark.location}
                    </p>
                  )}
                  {bookmark.reason && (
                    <p className="text-sm">{bookmark.reason}</p>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      By {bookmark.added_by}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDownload(bookmark.id, bookmark.report_type, bookmark.company_name)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete bookmark?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete this bookmark. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(bookmark.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
