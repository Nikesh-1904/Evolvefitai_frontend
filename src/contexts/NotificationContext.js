// src/contexts/NotificationContext.js - Notification State Management

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/api/authService';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await authService.getNotifications();
      const notificationsList = data.notifications || [];
      setNotifications(notificationsList);

      // Calculate unread count
      const unread = notificationsList.filter((n) => !n.is_read).length;
      setUnreadCount(unread);

      console.log(`✅ Fetched ${notificationsList.length} notifications (${unread} unread)`);
    } catch (err) {
      console.error('❌ Failed to fetch notifications:', err);
      setError(err.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Mark single notification as read
  const markAsRead = useCallback(async (notificationId) => {
    try {
      await authService.markNotificationAsRead(notificationId);

      // Update local state
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      );

      // Update unread count
      setUnreadCount((prev) => Math.max(0, prev - 1));

      console.log(`✅ Marked notification ${notificationId} as read`);
    } catch (err) {
      console.error(`❌ Failed to mark notification as read:`, err);
      throw err;
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      const unreadNotifications = notifications.filter((n) => !n.is_read);

      // Call API for each unread notification
      await Promise.all(
        unreadNotifications.map((notif) =>
          authService.markNotificationAsRead(notif.id)
        )
      );

      // Update local state
      setNotifications((prev) => prev.map((notif) => ({ ...notif, is_read: true })));
      setUnreadCount(0);

      console.log(`✅ Marked all ${unreadNotifications.length} notifications as read`);
    } catch (err) {
      console.error('❌ Failed to mark all as read:', err);
      throw err;
    }
  }, [notifications]);

  // Refresh notifications (useful after actions that might create notifications)
  const refresh = useCallback(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Initial fetch and periodic refresh
  useEffect(() => {
    if (user) {
      fetchNotifications();

      // Poll for new notifications every 60 seconds
      const interval = setInterval(fetchNotifications, 60000);

      return () => clearInterval(interval);
    }
  }, [user, fetchNotifications]);

  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    refresh,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
