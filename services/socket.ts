import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';

class SocketService {
  private socket: ReturnType<typeof io> | null = null;

  connect(token?: string): void {
    if (this.socket?.connected) return;

    const socketUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8000';
    
    this.socket = io(socketUrl, {
      auth: token ? { token } : undefined,
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
    });

    this.socket.on('disconnect', (reason: string) => {
      console.log('Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error: Error) => {
      console.error('Socket connection error:', error);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): ReturnType<typeof io> | null {
    return this.socket;
  }

  // Board rooms
  joinBoard(boardId: string): void {
    this.socket?.emit('joinBoard', boardId);
  }

  leaveBoard(boardId: string): void {
    this.socket?.emit('leaveBoard', boardId);
  }

  // Event listeners
  onBoardCreated(callback: (board: any) => void): void {
    this.socket?.on('board_created', callback);
  }

  onBoardUpdated(callback: (board: any) => void): void {
    this.socket?.on('board_updated', callback);
  }

  onBoardArchived(callback: (board: any) => void): void {
    this.socket?.on('board_archived', callback);
  }

  onListCreated(callback: (list: any) => void): void {
    this.socket?.on('list_created', callback);
  }

  onListUpdated(callback: (list: any) => void): void {
    this.socket?.on('list_updated', callback);
  }

  onListDeleted(callback: (data: { listId: string }) => void): void {
    this.socket?.on('list_deleted', callback);
  }

  onListsReordered(callback: (data: { boardId: string; lists: string[] }) => void): void {
    this.socket?.on('lists_reordered', callback);
  }

  onCardCreated(callback: (card: any) => void): void {
    this.socket?.on('card_created', callback);
  }

  onCardUpdated(callback: (card: any) => void): void {
    this.socket?.on('card_updated', callback);
  }

  onCardMoved(callback: (data: { cardId: string; fromList: string; toList: string }) => void): void {
    this.socket?.on('card_moved', callback);
  }

  onCardReordered(callback: (data: { cardId: string; listId: string; position: number }) => void): void {
    this.socket?.on('card_reordered', callback);
  }

  onCommentCreated(callback: (comment: any) => void): void {
    this.socket?.on('comment_created', callback);
  }

  onCommentDeleted(callback: (data: { commentId: string }) => void): void {
    this.socket?.on('comment_deleted', callback);
  }

  // Remove listeners
  removeAllListeners(): void {
    this.socket?.removeAllListeners();
  }
}

export const socketService = new SocketService();