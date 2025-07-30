// components/Sessions.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { apiRequest } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Sessions = () => {
  const { authState } = useAuth();
  const { toast } = useToast();
  const [sessions, setSessions] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await apiRequest('/sessions');
        setSessions(response.sessions);
        setMessage(response.message);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error fetching sessions';
        setError(errorMessage);
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    };
    if (authState.initialized && authState.user) {
      fetchSessions();
    }
  }, [authState, toast]);

  const handleRevoke = async (sessionId) => {
    try {
      await apiRequest(`/sessions/${sessionId}`, {
        method: 'DELETE',
      });
      setSessions(sessions.filter(s => s._id !== sessionId));
      setMessage('Session revoked');
      toast({
        title: 'Success',
        description: 'Session revoked successfully',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error revoking session';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  if (!authState.initialized) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {message && <p className="mb-4 text-gray-600">{message}</p>}
          <ul className="space-y-4">
            {sessions.map(session => (
              <li key={session._id} className="border p-4 rounded-md">
                <p><strong>Token:</strong> {session.token}</p>
                <p><strong>Device:</strong> {session.deviceName}</p>
                <p><strong>Location:</strong> {session.location.city}, {session.location.region}, {session.location.country}</p>
                <p><strong>Created:</strong> {new Date(session.createdAt).toLocaleString()}</p>
                <p><strong>Expires:</strong> {new Date(session.expiresAt).toLocaleString()}</p>
                <p><strong>Active:</strong> {session.isActive ? 'Yes' : 'No'}</p>
                <p><strong>Last Accessed:</strong> {new Date(session.lastAccessed).toLocaleString()}</p>
                <Button
                  variant="destructive"
                  onClick={() => handleRevoke(session._id)}
                  disabled={!session.isActive}
                >
                  Revoke
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sessions;

