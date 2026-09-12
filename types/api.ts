import type { User } from '@/services/authService';

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
  labels: Array<{ id: string; text: string; color: string }>;
  members: User[];
  attachments: Array<{ id: string; name: string; url: string; type: string; size: number; uploadedAt: string }>;
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
  data: unknown;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  activities?: T[];
  pagination?: { total: number; page: number; limit: number; pages: number };
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
  token: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface VerifyEmailResponse {
  message: string;
  email: string;
  token?: string;
  verified: boolean;
  user?: User;
}
