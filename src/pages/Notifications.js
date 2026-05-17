// src/pages/Notifications.js — Evolve / minimal notifications

import React, { useState } from 'react';
import { Box, Stack, IconButton, CircularProgress, Alert } from '@mui/material';
import { MarkEmailRead, CheckCircle, Refresh } from '@mui/icons-material';
import { PageContainer } from '../components/design-system';
import { useNotifications } from '../contexts/NotificationContext';
import { ev } from '../theme/evolveDarkTheme';

const mono = { fontFamily: ev.mono };
const display = { fontFamily: ev.display };
const monoLabel = { ...mono, fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: ev.chalkDim };

const typeLabel = (t) => ({
  workout: 'Workout',
  achievement: 'Achievement',
  meal: 'Meal',
  progress: 'Progress',
  general: 'General',
}[t] || 'Update');

function Notifications() {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead, fetchNotifications } = useNotifications();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      setMessage('Marked as read');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setError('Failed to update notification');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setMessage('All notifications marked as read');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setError('Failed to update notifications');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <PageContainer
      title="Notifications"
      subtitle="App and account updates. Nothing fluffy — only signals you should actually read."
    >
      {message && <Alert severity="success" onClose={() => setMessage('')} sx={{ mb: 3 }}>{message}</Alert>}
      {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 3 }}>{error}</Alert>}

      {/* ============ TOP BAR ============ */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        py: 3,
        borderTop: `1px solid ${ev.rule}`,
        borderBottom: `1px solid ${ev.rule}`,
        mb: 5,
        gap: 3,
        flexWrap: 'wrap',
      }}>
        <Box>
          <Box sx={monoLabel}>Inbox</Box>
          <Box sx={{ ...display, fontSize: 28, color: ev.chalk, letterSpacing: '-0.015em', mt: 1.5 }}>
            {unreadCount > 0 ? <>
              {unreadCount} <Box component="em" sx={{ fontStyle: 'italic', color: ev.chalkDim }}>unread</Box>
            </> : <>All <Box component="em" sx={{ fontStyle: 'italic', color: ev.chalkDim }}>caught up</Box></>}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
          <Box
            onClick={fetchNotifications}
            sx={{
              cursor: 'pointer',
              ...mono,
              fontSize: 11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: ev.chalkDim,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              '&:hover': { color: ev.chalk },
            }}
          >
            <Refresh sx={{ fontSize: 14 }} /> Refresh
          </Box>
          {unreadCount > 0 && (
            <Box
              onClick={handleMarkAllAsRead}
              sx={{
                cursor: 'pointer',
                ...mono,
                fontSize: 11,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: ev.chalkDim,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                '&:hover': { color: ev.accent },
              }}
            >
              <CheckCircle sx={{ fontSize: 14 }} /> Mark all read
            </Box>
          )}
        </Box>
      </Box>

      {/* ============ LIST ============ */}
      {loading ? (
        <Box sx={{ display: 'grid', placeItems: 'center', py: 8 }}>
          <CircularProgress size={28} />
        </Box>
      ) : notifications.length === 0 ? (
        <Box sx={{ py: '80px', borderTop: `1px solid ${ev.rule}`, borderBottom: `1px solid ${ev.rule}`, textAlign: 'center' }}>
          <Box sx={{ ...display, fontSize: 32, color: ev.chalk, letterSpacing: '-0.015em' }}>
            Empty<Box component="span" sx={{ color: ev.accent }}>.</Box>
          </Box>
          <Box sx={{ ...monoLabel, color: ev.chalkMute, mt: 2 }}>Nothing new. Check back later.</Box>
        </Box>
      ) : (
        <Stack spacing={0}>
          {notifications.map((n, i) => (
            <Box
              key={n.id}
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '40px 1fr auto', md: '40px 120px 1fr auto 40px' },
                gap: 3,
                alignItems: 'baseline',
                py: '24px',
                borderTop: `1px solid ${ev.rule}`,
                '&:last-of-type': { borderBottom: `1px solid ${ev.rule}` },
                transition: 'background-color .15s ease',
                '&:hover': { backgroundColor: ev.ruleSoft },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                {!n.is_read && (
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: ev.accent, mt: '4px' }} />
                )}
                <Box sx={{ ...mono, fontSize: 11, letterSpacing: '0.1em', color: ev.chalkMute }}>
                  {String(i + 1).padStart(2, '0')}
                </Box>
              </Box>
              <Box sx={{ ...monoLabel, color: ev.chalkMute, display: { xs: 'none', md: 'block' } }}>
                {typeLabel(n.type)}
              </Box>
              <Box>
                <Box sx={{
                  ...display,
                  fontSize: 20,
                  letterSpacing: '-0.005em',
                  color: n.is_read ? ev.chalkDim : ev.chalk,
                  lineHeight: 1.2,
                }}>
                  {n.title}
                </Box>
                <Box sx={{ color: n.is_read ? ev.chalkMute : ev.chalkDim, fontSize: 14, lineHeight: 1.55, mt: 1, maxWidth: '70ch' }}>
                  {n.message}
                </Box>
                <Box sx={{ ...monoLabel, color: ev.chalkMute, mt: 1.5 }}>
                  {new Date(n.created_at).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </Box>
              </Box>
              <Box sx={{ ...monoLabel, color: ev.chalkMute, alignSelf: 'flex-start', display: { xs: 'block', md: 'none' } }}>
                {typeLabel(n.type)}
              </Box>
              <Box sx={{ alignSelf: 'flex-start' }}>
                {!n.is_read && (
                  <IconButton size="small" onClick={() => handleMarkAsRead(n.id)} sx={{ color: ev.chalkMute, '&:hover': { color: ev.accent } }}>
                    <MarkEmailRead fontSize="small" />
                  </IconButton>
                )}
              </Box>
            </Box>
          ))}
        </Stack>
      )}
    </PageContainer>
  );
}

export default Notifications;
