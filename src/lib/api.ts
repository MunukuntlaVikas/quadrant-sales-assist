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

export interface ChatRequest {
  company_name: string;
  question: string;
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
    return this.request('/projects/hunt', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Company Analysis
  async analyzeCompany(data: CompanyAnalysisRequest) {
    return this.request('/projects/analyze-company', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Email Generation and Sending
  async sendEmail(data: EmailRequest) {
    return this.request('/sales/email', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Basic Bookmarks
  async addBookmark(data: BookmarkRequest) {
    return this.request('/projects/bookmark', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getBookmarks(addedBy?: string) {
    const params = addedBy ? `?added_by=${encodeURIComponent(addedBy)}` : '';
    return this.request(`/projects/bookmarks${params}`);
  }

  // Enhanced Bookmarks
  async addHuntBookmark(data: HuntBookmarkRequest) {
    return this.request('/projects/hunt/bookmark', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async addAnalysisBookmark(data: AnalysisBookmarkRequest) {
    return this.request('/projects/analyze-company/bookmark', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getEnhancedBookmarks(addedBy?: string, reportType?: string) {
    const params = new URLSearchParams();
    if (addedBy) params.append('added_by', addedBy);
    if (reportType) params.append('report_type', reportType);
    const queryString = params.toString();
    return this.request(`/projects/bookmarks/enhanced${queryString ? '?' + queryString : ''}`);
  }

  async deleteEnhancedBookmark(id: number) {
    return this.request(`/projects/bookmarks/${id}`, {
      method: 'DELETE',
    });
  }

  // Documents
  async downloadBookmarkDocument(id: number) {
    const response = await fetch(`${this.baseUrl}/projects/bookmarks/${id}/download`);
    if (!response.ok) throw new Error('Download failed');
    return response.blob();
  }

  // Chat
  async chat(companyName: string, question: string) {
    return this.request('/projects/chat', {
      method: 'POST',
      body: JSON.stringify({ company_name: companyName, question }),
    });
  }

  async chatEnhanced(companyName: string, question: string) {
    return this.request('/projects/chat/enhanced', {
      method: 'POST',
      body: JSON.stringify({ company_name: companyName, question }),
    });
  }
}

export const apiClient = new ApiClient();
