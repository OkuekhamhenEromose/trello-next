'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/services/api';
import type { Board } from '@/services/api';
import { socketService } from '@/services/socket';
import { useAuth } from '@/contexts/AuthContext';

export const useBoards = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const fetchBoards = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getBoards();
      setBoards(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch boards');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchBoards();

    // Socket listeners
    socketService.onBoardCreated((board: Board) => {
      setBoards((prev) => [board, ...prev]);
    });

    socketService.onBoardUpdated((updatedBoard: Board) => {
      setBoards((prev) => prev.map((b) => 
        b._id === updatedBoard._id ? updatedBoard : b
      ));
    });

    socketService.onBoardArchived((archivedBoard: Board) => {
      setBoards((prev) => prev.filter((b) => b._id !== archivedBoard._id));
    });

    return () => {
      socketService.removeAllListeners();
    };
  }, [fetchBoards]);

  const createBoard = async (data: { title: string; description?: string; background_color?: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const newBoard = await api.createBoard(data);
      setBoards((prev) => [newBoard, ...prev]);
      return newBoard;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create board');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateBoard = async (id: string, data: Partial<Board>) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedBoard = await api.updateBoard(id, data);
      setBoards((prev) => prev.map((b) => b._id === id ? updatedBoard : b));
      return updatedBoard;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update board');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const archiveBoard = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.archiveBoard(id);
      setBoards((prev) => prev.filter((b) => b._id !== id));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to archive board');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    boards,
    isLoading,
    error,
    fetchBoards,
    createBoard,
    updateBoard,
    archiveBoard,
  };
};