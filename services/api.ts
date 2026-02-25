import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Types
export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profile?: {
    fullname?: string;
    phone?: string;
  };
}

export interface Board {
  _id: string;
  title: string;
  description: string;
  owner: User | string;
  members: User[];
  background_color: string;
  background_image: string | null;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
  lists?: List[];
}

export interface VerifyEmailResponse{
  message: string;
  email: string;
  token?: string;        // JWT token for auto-login
  verified: boolean;
  user?: User;
}

export interface List {
  _id: string;
  title: string;
  board: string | Board;
  position: number;
  cards?: Card[];
  createdAt: string;
  updatedAt: string;
}

export interface Card {
  _id: string;
  title: string;
  description: string;
  list: string | List;
  position: number;
  due_date: string | null;
  labels: Array<{
    id: string;
    text: string;
    color: string;
  }>;
  members: User[];
  attachments: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
    uploadedAt: string;
  }>;
  archived: boolean;
  comments?: Comment[];
  checklists?: Checklist[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  text: string;
  card: string | Card;
  author: User;
  createdAt: string;
  updatedAt: string;
}

export interface Checklist {
  _id: string;
  title: string;
  card: string | Card;
  items?: ChecklistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistItem {
  _id: string;
  text: string;
  checklist: string | Checklist;
  completed: boolean;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  _id: string;
  board: string | Board;
  user: User;
  activity_type: 'CREATE' | 'UPDATE' | 'DELETE' | 'MOVE' | 'COMMENT' | 'COMPLETE';
  description: string;
  data: any;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  activities?: T[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface LoginCredentials {
  email?: string;
  username?: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  password2: string;
  fullname?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface ApiError {
  error: string;
  message?: string;
  errors?: Array<{ msg: string }>;
}

class ApiService {
  private api: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    // Request interceptor to add token
    this.api.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          this.clearToken();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );

    // Load token from localStorage on client side
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('trello_token');
    }
  }

  // Token management
  setToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('trello_token', token);
    }
  }

  getToken(): string | null {
    return this.token;
  }

  clearToken(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('trello_token');
    }
  }

  // Helper method for requests
  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api(config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // ============= AUTH ENDPOINTS =============
  
  async startRegistration(email: string): Promise<{ message: string; email: string; token: string; expiresAt: string }> {
    return this.request({
      method: 'POST',
      url: '/auth/register/start',
      data: { email },
    });
  }

  async verifyEmail(email: string, verificationCode?: string, token?: string): Promise<VerifyEmailResponse> {
  return this.request({
    method: 'POST',
    url: '/auth/register/verify',
    data: { email, verificationCode, token },
  });
}

  async completeRegistration(data: RegisterData): Promise<AuthResponse> {
    return this.request({
      method: 'POST',
      url: '/auth/register/complete',
      data,
    });
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>({
      method: 'POST',
      url: '/auth/login',
      data: credentials,
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async logout(): Promise<{ message: string }> {
    try {
      return await this.request({
        method: 'POST',
        url: '/auth/logout',
      });
    } finally {
      this.clearToken();
    }
  }

  async getProfile(): Promise<{ user: User }> {
    return this.request({
      method: 'GET',
      url: '/auth/profile',
    });
  }

  async updateProfile(data: Partial<User>): Promise<{ message: string; user: User }> {
    return this.request({
      method: 'PUT',
      url: '/auth/profile',
      data,
    });
  }

  async checkEmail(email: string): Promise<{ email: string; available: boolean; exists: boolean }> {
    return this.request({
      method: 'POST',
      url: '/auth/check-email',
      data: { email },
    });
  }

  // ============= BOARD ENDPOINTS =============

  async getBoards(): Promise<Board[]> {
    return this.request({
      method: 'GET',
      url: '/boards',
    });
  }

  async getBoard(id: string): Promise<Board & { lists: List[] }> {
    return this.request({
      method: 'GET',
      url: `/boards/${id}`,
    });
  }

  async createBoard(data: { title: string; description?: string; background_color?: string; member_ids?: string[] }): Promise<Board> {
    return this.request({
      method: 'POST',
      url: '/boards',
      data,
    });
  }

  async updateBoard(id: string, data: Partial<Board>): Promise<Board> {
    return this.request({
      method: 'PUT',
      url: `/boards/${id}`,
      data,
    });
  }

  async archiveBoard(id: string): Promise<{ message: string }> {
    return this.request({
      method: 'DELETE',
      url: `/boards/${id}`,
    });
  }

  async reorderLists(boardId: string, lists: string[]): Promise<{ message: string }> {
    return this.request({
      method: 'PUT',
      url: `/boards/${boardId}/reorder`,
      data: { lists },
    });
  }

  // Remove duplicate getBoardActivities - keep only one version
  // The one above is for boards, the one below is for activities
  // I'll rename the activities version to avoid conflict

  // ============= LIST ENDPOINTS =============

  async getLists(boardId?: string): Promise<List[]> {
    return this.request({
      method: 'GET',
      url: '/lists',
      params: { board_id: boardId },
    });
  }

  async getList(id: string): Promise<List> {
    return this.request({
      method: 'GET',
      url: `/lists/${id}`,
    });
  }

  async createList(data: { title: string; board: string; position?: number }): Promise<List> {
    return this.request({
      method: 'POST',
      url: '/lists',
      data,
    });
  }

  async updateList(id: string, data: Partial<List>): Promise<List> {
    return this.request({
      method: 'PUT',
      url: `/lists/${id}`,
      data,
    });
  }

  async deleteList(id: string): Promise<{ message: string }> {
    return this.request({
      method: 'DELETE',
      url: `/lists/${id}`,
    });
  }

  // ============= CARD ENDPOINTS =============

  async getCards(listId?: string): Promise<Card[]> {
    return this.request({
      method: 'GET',
      url: '/cards',
      params: { list_id: listId },
    });
  }

  async getCard(id: string): Promise<Card> {
    return this.request({
      method: 'GET',
      url: `/cards/${id}`,
    });
  }

  async createCard(data: {
    title: string;
    description?: string;
    list: string;
    position?: number;
    due_date?: string | null;
    labels?: Array<{ id: string; text: string; color: string }>;
    member_ids?: string[];
    attachments?: any[];
  }): Promise<Card> {
    return this.request({
      method: 'POST',
      url: '/cards',
      data,
    });
  }

  async updateCard(id: string, data: Partial<Card>): Promise<Card> {
    return this.request({
      method: 'PUT',
      url: `/cards/${id}`,
      data,
    });
  }

  async moveCard(id: string, destination_list_id?: string, position?: number): Promise<Card> {
    return this.request({
      method: 'PUT',
      url: `/cards/${id}/move`,
      data: { destination_list_id, position },
    });
  }

  // ============= COMMENT ENDPOINTS =============

  async createComment(data: { text: string; card: string }): Promise<Comment> {
    return this.request({
      method: 'POST',
      url: '/comments',
      data,
    });
  }

  async updateComment(id: string, text: string): Promise<Comment> {
    return this.request({
      method: 'PUT',
      url: `/comments/${id}`,
      data: { text },
    });
  }

  async deleteComment(id: string): Promise<{ message: string }> {
    return this.request({
      method: 'DELETE',
      url: `/comments/${id}`,
    });
  }

  // ============= CHECKLIST ENDPOINTS =============

  async createChecklist(data: { title?: string; card: string }): Promise<Checklist> {
    return this.request({
      method: 'POST',
      url: '/checklists',
      data,
    });
  }

  async addChecklistItem(data: { text: string; checklist: string; position?: number }): Promise<ChecklistItem> {
    return this.request({
      method: 'POST',
      url: '/checklist-items',
      data,
    });
  }

  async updateChecklistItem(id: string, data: { text?: string; completed?: boolean }): Promise<ChecklistItem> {
    return this.request({
      method: 'PUT',
      url: `/checklist-items/${id}`,
      data,
    });
  }

  // ============= ACTIVITY ENDPOINTS =============
  // Renamed from getBoardActivities to avoid conflict with board version

  async getBoardActivityList(boardId: string, limit?: number, page?: number): Promise<PaginatedResponse<Activity>> {
    return this.request({
      method: 'GET',
      url: `/activities/board/${boardId}`,
      params: { limit, page },
    });
  }

  async getUserActivities(limit?: number): Promise<Activity[]> {
    return this.request({
      method: 'GET',
      url: '/activities/user',
      params: { limit },
    });
  }

  async getActivity(id: string): Promise<Activity> {
    return this.request({
      method: 'GET',
      url: `/activities/${id}`,
    });
  }

  async deleteActivity(id: string): Promise<{ message: string }> {
    return this.request({
      method: 'DELETE',
      url: `/activities/${id}`,
    });
  }

  async clearBoardActivities(boardId: string): Promise<{ message: string }> {
    return this.request({
      method: 'DELETE',
      url: `/activities/board/${boardId}/clear`,
    });
  }

  // ============= HEALTH CHECK =============

  async healthCheck(): Promise<{ status: string; timestamp: string; database: string }> {
    return this.request({
      method: 'GET',
      url: '/health',
    });
  }
}

// Create singleton instance
export const api = new ApiService();

// Helper hook for React components
export const useApi = () => api;

export default api;