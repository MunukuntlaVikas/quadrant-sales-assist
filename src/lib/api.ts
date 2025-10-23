/**
 * API client for Quadrant Sales Agent backend
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface ProjectHuntRequest {
  domain_focus?: string;
  location?: string;
  industry?: string;
}

export interface CompanyAnalysisRequest {
  company_name?: string;
  industry?: string;
  location?: string;
}

export interface EmailRequest {
  client_name: string;
  company: string;
  email: string;
  domain: string;
  lead_context?: string;
}

export interface BookmarkRequest {
  company_name: string;
  analysis_summary: string;
  added_by: string;
  reason: string;
}

export interface HuntBookmarkRequest {
  company_name: string;
  domain_focus: string;
  industry?: string;
  location?: string;
  full_report_content: string;
  added_by: string;
  reason: string;
}

export interface AnalysisBookmarkRequest {
  company_name: string;
  industry?: string;
  location?: string;
  full_report_content: string;
  added_by: string;
  reason: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Request failed' }));
      throw new Error(error.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Project Hunt
  async huntProjects(data: ProjectHuntRequest) {
    return this.request('/hunt/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Company Analysis
  async analyzeCompany(data: CompanyAnalysisRequest) {
    return this.request('/analyze/company', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Email Generation
  async generateEmail(data: EmailRequest) {
    return this.request('/email/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async sendEmail(data: EmailRequest) {
    return this.request('/email/send', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Bookmarks
  async addBookmark(data: BookmarkRequest) {
    return this.request('/bookmarks/add', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getBookmarks(addedBy?: string) {
    const params = addedBy ? `?added_by=${encodeURIComponent(addedBy)}` : '';
    return this.request(`/bookmarks/list${params}`);
  }

  async getBookmarkByCompany(companyName: string) {
    return this.request(`/bookmarks/company/${encodeURIComponent(companyName)}`);
  }

  // Enhanced Bookmarks
  async addHuntBookmark(data: HuntBookmarkRequest) {
    return this.request('/bookmarks/hunt/add', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async addAnalysisBookmark(data: AnalysisBookmarkRequest) {
    return this.request('/bookmarks/analysis/add', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getEnhancedBookmarks() {
    return this.request('/bookmarks/enhanced/list');
  }

  async getEnhancedBookmark(id: number) {
    return this.request(`/bookmarks/enhanced/${id}`);
  }

  async deleteEnhancedBookmark(id: number) {
    return this.request(`/bookmarks/enhanced/${id}`, {
      method: 'DELETE',
    });
  }

  // Documents
  async downloadHuntReport(id: number) {
    const response = await fetch(`${this.baseUrl}/documents/hunt/download/${id}`);
    if (!response.ok) throw new Error('Download failed');
    return response.blob();
  }

  async downloadAnalysisReport(id: number) {
    const response = await fetch(`${this.baseUrl}/documents/analysis/download/${id}`);
    if (!response.ok) throw new Error('Download failed');
    return response.blob();
  }

  // Chat
  async chat(message: string, context?: string) {
    return this.request('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, context }),
    });
  }
}

export const apiClient = new ApiClient();
