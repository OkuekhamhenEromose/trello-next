import { io, type Socket } from 'socket.io-client';
import type { Board, Card, List } from '@/services/api';

export type SocketEventMap = {
  board_created: Board;
  board_updated: Board;
  board_archived: Board;
  list_created: List;
  list_updated: List;
  list_deleted: { listId: string };
  lists_reordered: { boardId: string; lists: string[] };
  card_created: Card;
  card_updated: Card;
  card_moved: {
    cardId: string;
    fromList: string;
    toList: string;
  };
  card_reordered: {
    cardId: string;
    listId: string;
    position: number;
  };
  comment_created: unknown;
  comment_deleted: {
    commentId: string;
  };
};

type ServerToClientEvents = {
  [K in keyof SocketEventMap]: (payload: SocketEventMap[K]) => void;
};

type ClientToServerEvents = {
  joinBoard: (boardId: string) => void;
  leaveBoard: (boardId: string) => void;
};

type TrelloSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

class SocketService {
  private socket: TrelloSocket | null = null;

  connect(token?: string): void {
    if (this.socket) {
      this.socket.auth = token ? { token } : {};

      if (!this.socket.connected) {
        this.socket.connect();
      }

      return;
    }

    const socketUrl =
      process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:5000';

    this.socket = io(socketUrl, {
      auth: token ? { token } : {},
      transports: ['websocket'],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    }) as TrelloSocket;
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }

  getSocket(): TrelloSocket | null {
    return this.socket;
  }

  joinBoard(boardId: string): void {
    this.socket?.emit('joinBoard', boardId);
  }

  leaveBoard(boardId: string): void {
    this.socket?.emit('leaveBoard', boardId);
  }

  on<K extends keyof SocketEventMap>(
    event: K,
    callback: (payload: SocketEventMap[K]) => void,
  ): () => void {
    const socket = this.socket;

    if (!socket) {
      return () => undefined;
    }

    const listener = callback as (
      payload: SocketEventMap[K],
    ) => void;

    socket.on(event, listener as never);

    return () => {
      socket.off(event, listener as never);
    };
  }

  removeListener<K extends keyof SocketEventMap>(
    event: K,
    callback: (payload: SocketEventMap[K]) => void,
  ): void {
    this.socket?.off(event, callback as never);
  }

  onBoardCreated(
    callback: (payload: Board) => void,
  ): () => void {
    return this.on('board_created', callback);
  }

  onBoardUpdated(
    callback: (payload: Board) => void,
  ): () => void {
    return this.on('board_updated', callback);
  }

  onBoardArchived(
    callback: (payload: Board) => void,
  ): () => void {
    return this.on('board_archived', callback);
  }

  onListCreated(
    callback: (payload: List) => void,
  ): () => void {
    return this.on('list_created', callback);
  }

  onListUpdated(
    callback: (payload: List) => void,
  ): () => void {
    return this.on('list_updated', callback);
  }

  onListDeleted(
    callback: (payload: { listId: string }) => void,
  ): () => void {
    return this.on('list_deleted', callback);
  }

  onListsReordered(
    callback: (payload: {
      boardId: string;
      lists: string[];
    }) => void,
  ): () => void {
    return this.on('lists_reordered', callback);
  }

  onCardCreated(
    callback: (payload: Card) => void,
  ): () => void {
    return this.on('card_created', callback);
  }

  onCardUpdated(
    callback: (payload: Card) => void,
  ): () => void {
    return this.on('card_updated', callback);
  }

  onCardMoved(
    callback: (payload: {
      cardId: string;
      fromList: string;
      toList: string;
    }) => void,
  ): () => void {
    return this.on('card_moved', callback);
  }

  onCardReordered(
    callback: (payload: {
      cardId: string;
      listId: string;
      position: number;
    }) => void,
  ): () => void {
    return this.on('card_reordered', callback);
  }

  onCommentCreated(
    callback: (payload: unknown) => void,
  ): () => void {
    return this.on('comment_created', callback);
  }

  onCommentDeleted(
    callback: (payload: { commentId: string }) => void,
  ): () => void {
    return this.on('comment_deleted', callback);
  }
}

export const socketService = new SocketService();
