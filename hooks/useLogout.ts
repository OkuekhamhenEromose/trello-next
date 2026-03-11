import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { socketService } from '@/services/socket';

export function useLogout() {
  const router = useRouter();

  const logout = useCallback(async (logoutAll: boolean = false) => {
    try {
      // Disconnect socket first
      socketService.disconnect();
      
      // Call logout API
      if (logoutAll) {
        await authService.logoutAll(); // You'll need to add this method
      } else {
        await authService.logout();
      }
      
      // Clear any local state
      authService.clearToken();
      
      // Redirect to login
      router.push('/login?message=logged_out');
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if API fails, clear local state and redirect
      authService.clearToken();
      router.push('/login');
    }
  }, [router]);

  return { logout };
}