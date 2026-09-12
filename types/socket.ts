import type { Board, Card, List } from '@/types/api';

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
  card_moved: { cardId: string; fromList: string; toList: string };
  card_reordered: { cardId: string; listId: string; position: number };
  comment_created: unknown;
  comment_deleted: { commentId: string };
};

export type ServerToClientEvents = {
  [K in keyof SocketEventMap]: (payload: SocketEventMap[K]) => void;
};

export type ClientToServerEvents = {
  joinBoard: (boardId: string) => void;
  leaveBoard: (boardId: string) => void;
};
