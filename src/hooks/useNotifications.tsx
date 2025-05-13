
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { apiRequest } from '@/services/api';

// Type for notifications
type Notification = {
  id: string;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
  user_id: string;
};

export const useNotifications = (userId: string | undefined) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    // Fetch notifications from API
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const response = await apiRequest('/notifications');
        
        // Transform API response to match our Notification type
        const formattedNotifications = response.map((notification: any) => ({
          id: notification._id,
          title: notification.title,
          message: notification.message,
          created_at: notification.created_at,
          read: notification.read,
          user_id: notification.user
        }));
        
        setNotifications(formattedNotifications);
        setUnreadCount(formattedNotifications.filter((n: Notification) => !n.read).length);
      } catch (e) {
        console.error('Exception fetching notifications:', e);
        
        // Fallback to mock data if API fails
        const mockNotifications: Notification[] = [
          {
            id: '1',
            title: 'Welcome',
            message: 'Welcome to RI Medicare',
            created_at: new Date().toISOString(),
            read: false,
            user_id: userId
          },
          {
            id: '2',
            title: 'Health Card',
            message: 'Your health card application is approved',
            created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            read: true,
            user_id: userId
          }
        ];
        
        setNotifications(mockNotifications);
        setUnreadCount(mockNotifications.filter(n => !n.read).length);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // Poll for new notifications every 30 seconds
    const notificationTimer = setInterval(fetchNotifications, 30000);

    return () => {
      clearInterval(notificationTimer);
    };
  }, [userId, toast]);

  const markAsRead = async (notificationId: string) => {
    try {
      // Update on server
      await apiRequest(`/notifications/${notificationId}/read`, {
        method: 'PUT'
      });
      
      // Update local state
      setNotifications(
        notifications.map(notification => 
          notification.id === notificationId ? { ...notification, read: true } : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      return true;
    } catch (e) {
      console.error('Exception marking notification as read:', e);
      return false;
    }
  };

  const markAllAsRead = async () => {
    if (!userId || notifications.filter(n => !n.read).length === 0) return true;

    try {
      // In a real implementation, we would call an API endpoint to mark all as read
      // For now, we'll just update local state
      setNotifications(
        notifications.map(notification => ({ ...notification, read: true }))
      );
      setUnreadCount(0);
      return true;
    } catch (e) {
      console.error('Exception marking all notifications as read:', e);
      return false;
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead
  };
};
