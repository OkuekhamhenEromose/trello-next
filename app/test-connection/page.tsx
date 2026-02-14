'use client';

import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { socketService } from '@/services/socket';
import { useAuth } from '@/contexts/AuthContext';

export default function TestConnection() {
  const [backendStatus, setBackendStatus] = useState('Testing...');
  const [socketStatus, setSocketStatus] = useState('Testing...');
  const [apiData, setApiData] = useState<any>(null);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test REST API
        const health = await api.healthCheck();
        setBackendStatus('✅ Connected to backend');
        setApiData(health);

        // Test Socket connection
        socketService.connect();
        setSocketStatus('✅ Socket connected');
      } catch (error: any) {
        setBackendStatus(`❌ Failed: ${error.message}`);
        console.error('Connection error:', error);
      }
    };

    testConnection();

    return () => {
      socketService.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Frontend-Backend Connection Test</h1>
        
        <div className="space-y-4">
          <div className="border-b pb-4">
            <h2 className="font-semibold mb-2">Configuration:</h2>
            <p className="text-sm">API URL: <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:5000/api</code></p>
            <p className="text-sm">WS URL: <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:5000</code></p>
          </div>

          <div className="border-b pb-4">
            <h2 className="font-semibold mb-2">REST API Status:</h2>
            <p className={backendStatus.includes('✅') ? 'text-green-600' : 'text-red-600'}>
              {backendStatus}
            </p>
            {apiData && (
              <pre className="mt-2 p-3 bg-gray-100 rounded text-sm overflow-auto">
                {JSON.stringify(apiData, null, 2)}
              </pre>
            )}
          </div>

          <div className="border-b pb-4">
            <h2 className="font-semibold mb-2">WebSocket Status:</h2>
            <p className={socketStatus.includes('✅') ? 'text-green-600' : 'text-yellow-600'}>
              {socketStatus}
            </p>
          </div>

          <div>
            <h2 className="font-semibold mb-2">Authentication:</h2>
            <p>{isAuthenticated ? '✅ Logged in' : '❌ Not logged in'}</p>
            {user && (
              <pre className="mt-2 p-3 bg-gray-100 rounded text-sm">
                {JSON.stringify(user, null, 2)}
              </pre>
            )}
          </div>

          <div className="mt-6 pt-4 border-t">
            <h2 className="font-semibold mb-2">Quick Test Links:</h2>
            <div className="space-y-2">
              <a 
                href="http://localhost:5000/api/health" 
                target="_blank" 
                className="block text-blue-600 hover:underline"
              >
                Backend Health Check
              </a>
              <a 
                href="http://localhost:5000/api/auth/test" 
                target="_blank" 
                className="block text-blue-600 hover:underline"
              >
                Auth Test Endpoint
              </a>
              <a 
                href="http://localhost:5000/api/boards" 
                target="_blank" 
                className="block text-blue-600 hover:underline"
              >
                Boards API (requires auth)
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}