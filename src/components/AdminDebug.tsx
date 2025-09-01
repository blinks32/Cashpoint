import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiRequest } from '../config/api';

const AdminDebug = () => {
  const { user } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkAdminStatus = async () => {
    setLoading(true);
    try {
      const response = await apiRequest('/api/debug/admin');
      const data = await response.json();
      setDebugInfo(data);
    } catch (error) {
      console.error('Debug check failed:', error);
      setDebugInfo({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testAdminAPI = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await apiRequest(`/api/admin/users?userId=${user.id}`, {
        headers: {
          'X-User-Id': user.id.toString(),
        },
      });
      
      if (response.ok) {
        const users = await response.json();
        setDebugInfo({ ...debugInfo, adminAPITest: { success: true, userCount: users.length, users } });
      } else {
        const error = await response.json();
        setDebugInfo({ ...debugInfo, adminAPITest: { success: false, error } });
      }
    } catch (error) {
      setDebugInfo({ ...debugInfo, adminAPITest: { success: false, error: error.message } });
    } finally {
      setLoading(false);
    }
  };

  if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    return null;
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 mb-4">
      <h3 className="text-white font-bold mb-3">Admin Debug Panel</h3>
      
      <div className="space-y-2 mb-4">
        <button
          onClick={checkAdminStatus}
          disabled={loading}
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-500 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Check System Status'}
        </button>
        
        <button
          onClick={testAdminAPI}
          disabled={loading}
          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-500 disabled:opacity-50 ml-2"
        >
          {loading ? 'Loading...' : 'Test Admin API'}
        </button>
      </div>

      {debugInfo && (
        <div className="bg-gray-900 p-3 rounded text-xs text-gray-300 overflow-auto max-h-64">
          <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default AdminDebug;