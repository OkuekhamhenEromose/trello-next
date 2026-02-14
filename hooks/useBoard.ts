'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/services/api';
import type { Board, List, Card } from '@/services/api';
import { socketService } from '@/services/socket';
import { useAuth } from '@/contexts/AuthContext';

type BoardWithLists = Board & { lists: List[] };

// Helper function to ensure complete Card object
const createCompleteCard = (card: Partial<Card> & { list: string | List }): Card => {
  const listId = typeof card.list === 'string' ? card.list : card.list._id;
  return {
    _id: card._id || '',
    title: card.title || '',
    description: card.description || '',
    list: listId,
    position: card.position || 0,
    due_date: card.due_date || null,
    labels: card.labels || [],
    members: card.members || [],
    attachments: card.attachments || [],
    archived: card.archived || false,
    comments: card.comments,
    checklists: card.checklists,
    createdAt: card.createdAt || new Date().toISOString(),
    updatedAt: card.updatedAt || new Date().toISOString(),
  };
};

// Helper function to ensure complete List object
const createCompleteList = (list: Partial<List> & { board: string | Board }): List => {
  const boardId = typeof list.board === 'string' ? list.board : list.board._id;
  return {
    _id: list._id || '',
    title: list.title || '',
    board: boardId,
    position: list.position || 0,
    cards: list.cards || [],
    createdAt: list.createdAt || new Date().toISOString(),
    updatedAt: list.updatedAt || new Date().toISOString(),
  };
};

export const useBoard = (boardId: string) => {
  const [board, setBoard] = useState<BoardWithLists | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const fetchBoard = useCallback(async () => {
    if (!isAuthenticated || !boardId) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getBoard(boardId);
      setBoard(data);
      socketService.joinBoard(boardId);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch board');
    } finally {
      setIsLoading(false);
    }
  }, [boardId, isAuthenticated]);

  useEffect(() => {
    fetchBoard();

    return () => {
      if (boardId) {
        socketService.leaveBoard(boardId);
      }
    };
  }, [fetchBoard, boardId]);

  useEffect(() => {
    if (!boardId) return;

    socketService.onBoardUpdated((updatedBoard: Board) => {
      if (updatedBoard._id === boardId) {
        setBoard((prev) => prev ? { ...prev, ...updatedBoard } : null);
      }
    });

    socketService.onListCreated((newList: List) => {
      if (newList.board === boardId) {
        setBoard((prev) => {
          if (!prev) return null;
          const completeList = createCompleteList(newList);
          return {
            ...prev,
            lists: [...prev.lists, completeList].sort((a, b) => a.position - b.position)
          };
        });
      }
    });

    socketService.onListUpdated((updatedList: List) => {
      if (updatedList.board === boardId) {
        setBoard((prev) => {
          if (!prev) return null;
          const completeList = createCompleteList(updatedList);
          return {
            ...prev,
            lists: prev.lists.map((l) => l._id === completeList._id ? completeList : l)
          };
        });
      }
    });

    socketService.onListDeleted(({ listId }) => {
      setBoard((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          lists: prev.lists.filter((l) => l._id !== listId)
        };
      });
    });

    socketService.onListsReordered((data) => {
      if (data.boardId === boardId) {
        fetchBoard();
      }
    });

    socketService.onCardCreated((newCard: Card) => {
      setBoard((prev) => {
        if (!prev) return null;
        
        const listId = typeof newCard.list === 'string' ? newCard.list : newCard.list._id;
        const completeCard = createCompleteCard(newCard);
        
        return {
          ...prev,
          lists: prev.lists.map((list) => 
            list._id === listId 
              ? { 
                  ...list, 
                  cards: [...(list.cards || []), completeCard].sort((a, b) => a.position - b.position) 
                }
              : list
          )
        };
      });
    });

    socketService.onCardUpdated((updatedCard: Card) => {
      setBoard((prev) => {
        if (!prev) return null;
        
        const listId = typeof updatedCard.list === 'string' ? updatedCard.list : updatedCard.list._id;
        const completeCard = createCompleteCard(updatedCard);
        
        return {
          ...prev,
          lists: prev.lists.map((list) => 
            list._id === listId 
              ? { 
                  ...list, 
                  cards: (list.cards || []).map((c) => 
                    c._id === completeCard._id ? completeCard : c
                  )
                }
              : list
          )
        };
      });
    });

    socketService.onCardMoved(({ cardId, fromList, toList }) => {
      setBoard((prev) => {
        if (!prev) return null;
        
        // Create a new board state with immutable updates
        const newLists = prev.lists.map((list) => {
          if (list._id === fromList) {
            // Remove card from source list
            return {
              ...list,
              cards: list.cards?.filter((card) => card._id !== cardId) || []
            };
          }
          return list;
        });

        // Find the moved card from the original board
        let movedCard: Card | undefined;
        const sourceList = prev.lists.find((l) => l._id === fromList);
        if (sourceList) {
          movedCard = sourceList.cards?.find((c) => c._id === cardId);
        }

        // If card found and destination list exists, add it
        if (movedCard) {
          const updatedCard = {
            ...movedCard,
            list: toList
          };
          
          return {
            ...prev,
            lists: newLists.map((list) => 
              list._id === toList 
                ? { 
                    ...list, 
                    cards: [...(list.cards || []), updatedCard].sort((a, b) => a.position - b.position) 
                  }
                : list
            )
          };
        }

        return { ...prev, lists: newLists };
      });
    });

    return () => {
      socketService.removeAllListeners();
    };
  }, [boardId, fetchBoard]);

  const createList = async (title: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const newList = await api.createList({
        title,
        board: boardId,
      });
      const completeList = createCompleteList(newList);
      setBoard((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          lists: [...prev.lists, completeList].sort((a, b) => a.position - b.position)
        };
      });
      return newList;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create list');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const createCard = async (listId: string, title: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const newCard = await api.createCard({
        title,
        list: listId,
      });
      return newCard;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create card');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const moveCard = async (cardId: string, destinationListId: string, position?: number) => {
    try {
      await api.moveCard(cardId, destinationListId, position);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to move card');
      throw err;
    }
  };

  const updateBoardDetails = async (data: Partial<Board>) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedBoard = await api.updateBoard(boardId, data);
      setBoard((prev) => prev ? { ...prev, ...updatedBoard } : null);
      return updatedBoard;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update board');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    board,
    isLoading,
    error,
    fetchBoard,
    createList,
    createCard,
    moveCard,
    updateBoard: updateBoardDetails,
  };
};