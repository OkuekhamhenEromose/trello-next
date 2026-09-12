import { authService, http, httpWithAuth, type User } from '@/services/authService';

import type {
  Activity,
  AuthResponse,
  Board,
  Card,
  Checklist,
  ChecklistItem,
  Comment,
  List,
  LoginCredentials,
  PaginatedResponse,
  RegisterData,
  VerifyEmailResponse,
} from '@/types/api';

export type { User } from '@/services/authService';

export type {
  Activity,
  AuthResponse,
  Board,
  Card,
  Checklist,
  ChecklistItem,
  Comment,
  List,
  LoginCredentials,
  PaginatedResponse,
  RegisterData,
  VerifyEmailResponse,
} from '@/types/api';

class ApiService {
  setToken(token: string) { authService.setToken(token); }
  getToken() { return authService.getToken(); }
  clearToken() { authService.clearToken(); }

  async startRegistration(email: string) {
    return http<{ message: string; email: string; token: string; expiresAt: string }>('POST', '/auth/register/start', { email });
  }

  async verifyEmail(email: string, verificationCode?: string, token?: string) {
    return http<VerifyEmailResponse>('POST', '/auth/register/verify', { email, verificationCode, token });
  }

  async completeRegistration(data: RegisterData) {
    const response = await http<AuthResponse>('POST', '/auth/register/complete', data);
    if (response.token) authService.setToken(response.token);
    return response;
  }

  async login(credentials: LoginCredentials) {
    const response = await http<AuthResponse>('POST', '/auth/login', credentials);
    if (response.token) authService.setToken(response.token);
    return response;
  }

  async logout() { return authService.logout().then(() => ({ message: 'Logged out successfully.' })); }

  async getProfile() { return httpWithAuth<{ user: User }>('GET', '/auth/profile'); }

  async updateProfile(data: Partial<User>) {
    const user = await authService.updateProfile(data);
    return { message: 'Profile updated successfully.', user };
  }

  async checkEmail(email: string) { return http<{ email: string; available: boolean; exists: boolean }>('POST', '/auth/check-email', { email }); }

  async getBoards() { return httpWithAuth<Board[]>('GET', '/boards'); }
  async getBoard(id: string) { return httpWithAuth<Board & { lists: List[] }>('GET', `/boards/${id}`); }
  async createBoard(data: { title: string; description?: string; background_color?: string; member_ids?: string[] }) { return httpWithAuth<Board>('POST', '/boards', data); }
  async updateBoard(id: string, data: Partial<Board>) { return httpWithAuth<Board>('PUT', `/boards/${id}`, data); }
  async archiveBoard(id: string) { return httpWithAuth<{ message: string }>('DELETE', `/boards/${id}`); }
  async reorderLists(boardId: string, lists: string[]) { return httpWithAuth<{ message: string }>('PUT', `/boards/${boardId}/reorder`, { lists }); }

  async getLists(boardId?: string) {
    const suffix = boardId ? `?board_id=${encodeURIComponent(boardId)}` : '';
    return httpWithAuth<List[]>('GET', `/lists${suffix}`);
  }
  async getList(id: string) { return httpWithAuth<List>('GET', `/lists/${id}`); }
  async createList(data: { title: string; board: string; position?: number }) { return httpWithAuth<List>('POST', '/lists', data); }
  async updateList(id: string, data: Partial<List>) { return httpWithAuth<List>('PUT', `/lists/${id}`, data); }
  async deleteList(id: string) { return httpWithAuth<{ message: string }>('DELETE', `/lists/${id}`); }

  async getCards(listId?: string) {
    const path = listId ? `/cards?list_id=${encodeURIComponent(listId)}` : '/cards';
    return httpWithAuth<Card[]>('GET', path);
  }
  async getCard(id: string) { return httpWithAuth<Card>('GET', `/cards/${id}`); }
  async createCard(data: { title: string; description?: string; list: string; position?: number; due_date?: string | null; labels?: Array<{ id: string; text: string; color: string }>; member_ids?: string[]; attachments?: unknown[] }) { return httpWithAuth<Card>('POST', '/cards', data); }
  async updateCard(id: string, data: Partial<Card>) { return httpWithAuth<Card>('PUT', `/cards/${id}`, data); }
  async moveCard(id: string, destination_list_id?: string, position?: number) { return httpWithAuth<Card>('PUT', `/cards/${id}/move`, { destination_list_id, position }); }

  async createComment(data: { text: string; card: string }) { return httpWithAuth<Comment>('POST', '/comments', data); }
  async updateComment(id: string, text: string) { return httpWithAuth<Comment>('PUT', `/comments/${id}`, { text }); }
  async deleteComment(id: string) { return httpWithAuth<{ message: string }>('DELETE', `/comments/${id}`); }

  async createChecklist(data: { title?: string; card: string }) { return httpWithAuth<Checklist>('POST', '/checklists', data); }
  async addChecklistItem(data: { text: string; checklist: string; position?: number }) { return httpWithAuth<ChecklistItem>('POST', '/checklist-items', data); }
  async updateChecklistItem(id: string, data: { text?: string; completed?: boolean }) { return httpWithAuth<ChecklistItem>('PUT', `/checklist-items/${id}`, data); }

  async getBoardActivityList(boardId: string, limit?: number, page?: number) {
    const params = new URLSearchParams();
    if (limit !== undefined) params.set('limit', String(limit));
    if (page !== undefined) params.set('page', String(page));
    const suffix = params.toString() ? `?${params}` : '';
    return httpWithAuth<PaginatedResponse<Activity>>('GET', `/activities/board/${boardId}${suffix}`);
  }
  async getUserActivities(limit?: number) {
    const suffix = limit === undefined ? '' : `?limit=${encodeURIComponent(limit)}`;
    return httpWithAuth<Activity[]>('GET', `/activities/user${suffix}`);
  }
  async getActivity(id: string) { return httpWithAuth<Activity>('GET', `/activities/${id}`); }
  async deleteActivity(id: string) { return httpWithAuth<{ message: string }>('DELETE', `/activities/${id}`); }
  async clearBoardActivities(boardId: string) { return httpWithAuth<{ message: string }>('DELETE', `/activities/board/${boardId}/clear`); }

  async healthCheck() { return http<{ status: string; timestamp: string; database?: string }>('GET', '/health'); }
}

export const api = new ApiService();
export const useApi = () => api;
export default api;
