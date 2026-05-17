// src/pages/Dashboard.js — Evolve / action-led tracker dashboard

import React, { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';
import { workoutService, analyticsService } from '../services/api';
import { ev } from '../theme/evolveDarkTheme';

const PAGE_X = 'clamp(28px, 6vw, 96px)';

const mono = { fontFamily: ev.mono };
const display = { fontFamily: ev.display };

const monoLabel = {
  ...mono,
  fontSize: 10,
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  color: ev.chalkDim,
};

const monoMeta = {
  ...mono,
  fontSize: 11,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: ev.chalkDim,
};

// ---------- small components ----------

function RowAction({ idx, label, onClick }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'grid',
        gridTemplateColumns: '40px 1fr 24px',
        gap: '28px',
        alignItems: 'baseline',
        py: '32px',
        borderTop: `1px solid ${ev.rule}`,
        '&:last-of-type': { borderBottom: `1px solid ${ev.rule}` },
        cursor: 'pointer',
        transition: 'padding-left .2s ease',
        '&:hover': {
          pl: '12px',
          '& .row-arrow': { color: ev.accent, transform: 'translateX(4px)' },
          '& .row-label': { color: ev.accent },
        },
      }}
    >
      <Box sx={{ ...mono, fontSize: 11, letterSpacing: '0.1em', color: ev.chalkMute }}>
        {String(idx).padStart(2, '0')}
      </Box>
      <Box
        className="row-label"
        sx={{
          ...display,
          fontSize: 'clamp(26px, 2.6vw, 36px)',
          lineHeight: 1.1,
          letterSpacing: '-0.015em',
          color: ev.chalk,
          transition: 'color .15s ease',
        }}
      >
        {label}
      </Box>
      <Box
        className="row-arrow"
        sx={{
          ...display,
          fontSize: 22,
          fontStyle: 'italic',
          color: ev.chalkMute,
          justifySelf: 'end',
          transition: 'color .15s ease, transform .15s ease',
        }}
      >
        ↗
      </Box>
    </Box>
  );
}

function StatCell({ index, label, value, unit, sub, accentSub, isLast, isFirst }) {
  return (
    <Box
      sx={{
        py: '40px',
        px: { xs: 3, md: '36px' },
        pl: { md: isFirst ? 0 : '36px' },
        pr: { md: isLast ? 0 : '36px' },
        borderRight: { md: isLast ? 'none' : `1px solid ${ev.rule}` },
        borderBottom: { xs: isLast ? 'none' : `1px solid ${ev.rule}`, md: 'none' },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Box sx={monoLabel}>{label}</Box>
        <Box sx={{ ...monoLabel, color: ev.chalkMute }}>{String(index).padStart(2, '0')}</Box>
      </Box>
      <Box
        sx={{
          ...display,
          fontSize: 'clamp(48px, 5vw, 72px)',
          lineHeight: 0.95,
          letterSpacing: '-0.025em',
          color: ev.chalk,
          mt: '24px',
        }}
      >
        {value}
        {unit && (
          <Box component="span" sx={{ ...mono, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: ev.chalkMute, ml: '6px' }}>
            {unit}
          </Box>
        )}
      </Box>
      {sub && (
        <Box sx={{ mt: '16px', ...mono, fontSize: 11, letterSpacing: '0.06em', color: accentSub || ev.chalkDim }}>
          {sub}
        </Box>
      )}
    </Box>
  );
}

function SectionHead({ title, italic, right }) {
  return (
    <Box sx={{ display: { xs: 'block', md: 'grid' }, gridTemplateColumns: '1fr 1fr', alignItems: 'end', mb: '56px' }}>
      <Box sx={{ ...display, fontSize: 'clamp(40px, 5vw, 56px)', lineHeight: 1, letterSpacing: '-0.02em', color: ev.chalk }}>
        {title}
        {italic && <Box component="em" sx={{ fontStyle: 'italic', color: ev.chalkDim }}> {italic}</Box>}
      </Box>
      {right && (
        <Box sx={{ justifySelf: { md: 'end' }, textAlign: { md: 'right' }, mt: { xs: 2, md: 0 }, display: 'grid', gap: '4px', ...monoMeta }}>
          {right}
        </Box>
      )}
    </Box>
  );
}

function PlanRow({ idx, plan, onOpen, onStart, isLast }) {
  return (
    <Box
      onClick={onOpen}
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '30px 1fr auto', md: '40px 1fr 140px 24px' },
        gap: '28px',
        alignItems: 'baseline',
        py: '28px',
        borderTop: `1px solid ${ev.rule}`,
        borderBottom: isLast ? `1px solid ${ev.rule}` : 'none',
        cursor: 'pointer',
        transition: 'padding-left .2s ease',
        '&:hover': { pl: '12px', '& .plan-arrow': { color: ev.accent } },
      }}
    >
      <Box sx={{ ...mono, fontSize: 11, letterSpacing: '0.1em', color: ev.chalkMute }}>
        {String(idx).padStart(2, '0')}
      </Box>
      <Box>
        <Box sx={{ ...display, fontSize: 'clamp(22px, 2.2vw, 28px)', letterSpacing: '-0.01em', color: ev.chalk, lineHeight: 1.1 }}>
          {plan.name}
        </Box>
        <Box sx={{ ...monoLabel, color: ev.chalkMute, mt: '8px' }}>
          {plan.description?.slice(0, 64) || (plan.ai_generated ? 'AI generated' : 'Manual plan')}
        </Box>
      </Box>
      <Box
        onClick={(e) => { e.stopPropagation(); onStart(plan); }}
        sx={{
          display: { xs: 'none', md: 'inline-flex' },
          alignItems: 'center',
          gap: 1,
          justifySelf: 'end',
          cursor: 'pointer',
          ...mono,
          fontSize: 11,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: ev.chalkDim,
          transition: 'color .15s ease',
          '&:hover': { color: ev.accent },
        }}
      >
        Begin →
      </Box>
      <Box className="plan-arrow" sx={{ ...display, fontSize: 18, fontStyle: 'italic', color: ev.chalkMute, justifySelf: 'end' }}>↗</Box>
    </Box>
  );
}

function ActivityRow({ idx, workout, isLast }) {
  const exerciseCount = Array.isArray(workout.exercises_completed)
    ? workout.exercises_completed.length
    : (typeof workout.exercises_completed === 'number' ? workout.exercises_completed : 0);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '30px 1fr', md: '40px 1fr 140px 140px' },
        gap: '28px',
        alignItems: 'baseline',
        py: '28px',
        borderTop: `1px solid ${ev.rule}`,
        borderBottom: isLast ? `1px solid ${ev.rule}` : 'none',
      }}
    >
      <Box sx={{ ...mono, fontSize: 11, letterSpacing: '0.1em', color: ev.chalkMute }}>
        {String(idx).padStart(2, '0')}
      </Box>
      <Box>
        <Box sx={{ ...display, fontSize: 'clamp(20px, 2vw, 26px)', letterSpacing: '-0.01em', color: ev.chalk, lineHeight: 1.1 }}>
          {new Date(workout.workout_date).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' })}
        </Box>
        <Box sx={{ ...monoLabel, color: ev.chalkMute, mt: '8px' }}>session log</Box>
      </Box>
      <Box sx={{ display: { xs: 'none', md: 'block' }, ...mono, fontSize: 13, color: ev.chalkDim, textAlign: 'right' }}>
        {workout.duration_minutes || '—'} <Box component="span" sx={{ color: ev.chalkMute }}>min</Box>
      </Box>
      <Box sx={{ display: { xs: 'none', md: 'block' }, ...mono, fontSize: 13, color: ev.chalkDim, textAlign: 'right' }}>
        {exerciseCount} <Box component="span" sx={{ color: ev.chalkMute }}>movements</Box>
      </Box>
    </Box>
  );
}

function EmptyRow({ title, hint, cta, onCta }) {
  return (
    <Box sx={{ py: '48px', borderTop: `1px solid ${ev.rule}`, borderBottom: `1px solid ${ev.rule}`, textAlign: 'center' }}>
      <Box sx={{ ...display, fontSize: 24, color: ev.chalk, letterSpacing: '-0.01em' }}>{title}</Box>
      <Box sx={{ ...monoLabel, color: ev.chalkMute, mt: '14px' }}>{hint}</Box>
      {cta && (
        <Box
          onClick={onCta}
          sx={{
            display: 'inline-flex',
            mt: '24px',
            cursor: 'pointer',
            ...mono,
            fontSize: 11,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: ev.chalk,
            borderBottom: `1px solid ${ev.chalk}`,
            pb: '4px',
            '&:hover': { color: ev.accent, borderColor: ev.accent },
          }}
        >
          {cta}
        </Box>
      )}
    </Box>
  );
}

// ---------- page ----------

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadDashboardData(); }, []);

  const loadDashboardData = async () => {
    try {
      const [logs, plans, statsData] = await Promise.all([
        workoutService.getWorkoutLogs(),
        workoutService.getWorkoutPlans(),
        analyticsService.getDashboardOverview(),
      ]);
      setRecentWorkouts(logs.slice(0, 4));
      setWorkoutPlans(plans.slice(0, 3));
      setStats(statsData);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '60vh', gap: 2 }}>
        <CircularProgress size={28} />
        <Box sx={monoLabel}>Loading dashboard</Box>
      </Box>
    );
  }

  const userName = user?.full_name || user?.email?.split('@')[0] || 'there';
  const firstName = userName.split(' ')[0];
  const level = stats?.level_progress?.current_level ?? 1;
  const completed = stats?.workouts_completed ?? 0;
  const totalHours = stats?.total_workout_time_hours ?? 0;
  const totalCalories = stats?.total_calories_burned ?? 0;
  const calChange = stats?.calories_change_percent ?? 0;
  const timeChange = stats?.time_change_percent ?? 0;

  const today = new Date();
  const dayLabel = today.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });

  const hasPlan = workoutPlans.length > 0;
  const firstPlan = workoutPlans[0];

  return (
    <Box sx={{ animation: 'ev-rise .5s ease both' }}>

      {/* ============ HERO ============ */}
      <Box sx={{ px: PAGE_X, pt: 'clamp(72px, 12vh, 140px)', pb: 'clamp(56px, 9vh, 110px)' }}>
        <Box sx={{ ...monoLabel, display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Box component="span" sx={{ color: ev.chalkMute }}>Today</Box>
          <Box component="span" sx={{ color: ev.chalkMute }}>/</Box>
          <Box component="span" sx={{ color: ev.chalk }}>{dayLabel}</Box>
        </Box>

        <Box
          component="h1"
          sx={{
            m: 0,
            mt: '40px',
            ...display,
            fontWeight: 400,
            fontSize: 'clamp(72px, 11vw, 168px)',
            lineHeight: 0.9,
            letterSpacing: '-0.025em',
            color: ev.chalk,
          }}
        >
          Welcome <Box component="em" sx={{ fontStyle: 'italic', color: ev.chalkDim }}>back,</Box>
          <br />
          {firstName}<Box component="span" sx={{ color: ev.accent }}>.</Box>
        </Box>

        <Box sx={{ mt: '40px', maxWidth: '52ch', color: ev.chalk, fontWeight: 500, fontSize: 17, lineHeight: 1.5 }}>
          Guided workouts, simple tracking, honest analysis. Pick something up where you left off, or start fresh below.
        </Box>
      </Box>

      {/* ============ WHAT NEXT ============ */}
      <Box sx={{ px: PAGE_X, py: 'clamp(64px, 10vh, 120px)', borderTop: `1px solid ${ev.rule}` }}>
        <SectionHead
          title="What"
          italic="next"
          right={
            <>
              <Box>Three ways to start</Box>
              <Box sx={{ color: ev.chalkMute }}>Pick the one that fits today</Box>
            </>
          }
        />

        <Box>
          <RowAction idx={1} label="Generate a workout"  onClick={() => navigate('/generate-workout')} />
          <RowAction idx={2} label="Log a workout"       onClick={() => navigate('/log-workout')} />
          {hasPlan ? (
            <RowAction idx={3} label={`Continue ${firstPlan.name}`} onClick={() => navigate('/workout-session', { state: { workoutPlan: firstPlan } })} />
          ) : (
            <RowAction idx={3} label="Get AI recommendations" onClick={() => navigate('/workout-recommendations')} />
          )}
        </Box>
      </Box>

      {/* ============ THIS WEEK / STATS ============ */}
      <Box sx={{ borderTop: `1px solid ${ev.rule}`, px: PAGE_X, py: 'clamp(48px, 8vh, 96px)' }}>
        <Box sx={{ ...monoLabel, mb: 4 }}>The numbers · so far</Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' } }}>
          <StatCell
            index={1}
            label="Workouts logged"
            value={completed}
            sub={completed > 0 ? 'All time' : 'No sessions yet'}
            isFirst
          />
          <StatCell
            index={2}
            label="Total hours"
            value={totalHours}
            unit="hr"
            sub={
              timeChange !== 0 ? (
                <>
                  {timeChange >= 0 ? '▲' : '▼'}{' '}
                  <Box component="b" sx={{ color: timeChange >= 0 ? ev.accent : ev.warn, fontWeight: 500 }}>{Math.abs(timeChange).toFixed(0)}%</Box> vs prior period
                </>
              ) : 'All time'
            }
          />
          <StatCell
            index={3}
            label="Total calories"
            value={totalCalories.toLocaleString()}
            unit="kcal"
            sub={
              calChange !== 0 ? (
                <>
                  {calChange >= 0 ? '▲' : '▼'}{' '}
                  <Box component="b" sx={{ color: calChange >= 0 ? ev.accent : ev.warn, fontWeight: 500 }}>{Math.abs(calChange).toFixed(0)}%</Box> vs prior period
                </>
              ) : 'All time'
            }
          />
          <StatCell
            index={4}
            label="Current level"
            value={String(level).padStart(2, '0')}
            sub={<>Tier · <Box component="b" sx={{ color: ev.chalk, fontWeight: 500 }}>progressing</Box></>}
            isLast
          />
        </Box>
      </Box>

      {/* ============ YOUR PLANS ============ */}
      <Box sx={{ px: PAGE_X, py: 'clamp(80px, 12vh, 140px)', borderTop: `1px solid ${ev.rule}` }}>
        <SectionHead
          title="Your"
          italic="plans"
          right={
            <>
              <Box>{workoutPlans.length} active</Box>
              <Box
                onClick={() => navigate('/workout-history')}
                sx={{ cursor: 'pointer', color: ev.chalkDim, '&:hover': { color: ev.accent } }}
              >
                View all →
              </Box>
            </>
          }
        />

        {workoutPlans.length === 0 ? (
          <EmptyRow
            title="No plans yet"
            hint="Generate your first AI-powered workout to get started"
            cta="Create first plan ↗"
            onCta={() => navigate('/generate-workout')}
          />
        ) : (
          <Box>
            {workoutPlans.map((plan, i) => (
              <PlanRow
                key={plan.id}
                idx={i + 1}
                plan={plan}
                onOpen={() => navigate(`/workout-plan/${plan.id}`)}
                onStart={(p) => navigate('/workout-session', { state: { workoutPlan: p } })}
                isLast={i === workoutPlans.length - 1}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* ============ RECENT ACTIVITY ============ */}
      <Box sx={{ px: PAGE_X, py: 'clamp(80px, 12vh, 140px)', borderTop: `1px solid ${ev.rule}` }}>
        <SectionHead
          title="Recent"
          italic="activity"
          right={
            <>
              <Box>{recentWorkouts.length} of last 30 days</Box>
              <Box
                onClick={() => navigate('/workout-history')}
                sx={{ cursor: 'pointer', color: ev.chalkDim, '&:hover': { color: ev.accent } }}
              >
                Open full log →
              </Box>
            </>
          }
        />

        {recentWorkouts.length === 0 ? (
          <EmptyRow
            title="Nothing logged yet"
            hint="Your completed sessions will appear here"
          />
        ) : (
          <Box>
            {recentWorkouts.map((w, i) => (
              <ActivityRow key={i} idx={i + 1} workout={w} isLast={i === recentWorkouts.length - 1} />
            ))}
          </Box>
        )}
      </Box>

      {/* ============ EXPLORE ============ */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, borderTop: `1px solid ${ev.rule}` }}>
        {[
          { label: 'Exercise library', sub: 'Browse with form notes and videos', to: '/exercises' },
          { label: 'Your analytics',   sub: 'Volume, time, trends across weeks',  to: '/analytics' },
          { label: 'Recommendations',  sub: 'Plans tailored to your history',     to: '/workout-recommendations' },
        ].map((card, i, arr) => (
          <Box
            key={card.label}
            onClick={() => navigate(card.to)}
            sx={{
              p: 'clamp(40px, 6vw, 64px)',
              cursor: 'pointer',
              borderRight: { md: i < arr.length - 1 ? `1px solid ${ev.rule}` : 'none' },
              borderBottom: { xs: i < arr.length - 1 ? `1px solid ${ev.rule}` : 'none', md: 'none' },
              transition: 'background-color .15s ease',
              '&:hover': { backgroundColor: ev.ink2, '& .ex-arrow': { color: ev.accent, transform: 'translateX(4px)' } },
            }}
          >
            <Box sx={{ ...monoLabel }}>0{i + 1}</Box>
            <Box sx={{ ...display, fontSize: 'clamp(26px, 2.6vw, 36px)', letterSpacing: '-0.015em', color: ev.chalk, mt: 2, lineHeight: 1.1 }}>
              {card.label}
            </Box>
            <Box sx={{ mt: 2, color: ev.chalkDim, fontSize: 14, fontWeight: 400, lineHeight: 1.5, maxWidth: '36ch' }}>
              {card.sub}
            </Box>
            <Box className="ex-arrow" sx={{ ...display, fontStyle: 'italic', fontSize: 24, color: ev.chalkMute, mt: 4, transition: 'color .15s ease, transform .15s ease' }}>↗</Box>
          </Box>
        ))}
      </Box>

      {/* ============ WORDMARK FOOTER ============ */}
      <Box sx={{ px: PAGE_X, pt: 'clamp(120px, 18vh, 220px)', pb: '64px', borderTop: `1px solid ${ev.rule}` }}>
        <Box sx={{ ...display, fontSize: 'clamp(120px, 18vw, 260px)', lineHeight: 0.84, letterSpacing: '-0.04em', color: ev.chalk, m: 0 }}>
          Evolvefit<Box component="span" sx={{ color: ev.accent }}>.</Box>
          <Box component="span" sx={{ fontStyle: 'italic', color: ev.chalkDim, fontSize: '0.5em', verticalAlign: 'baseline', ml: '0.15em' }}>AI</Box>
        </Box>
        <Box sx={{ mt: '64px', display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: '32px', pt: '28px', borderTop: `1px solid ${ev.rule}`, ...monoLabel, color: ev.chalkMute }}>
          <Box><Box component="b" sx={{ color: ev.chalk, fontWeight: 500 }}>Build 2026.05</Box></Box>
          <Box>Guide · track · analyse</Box>
          <Box sx={{ justifySelf: { md: 'end' }, textAlign: { md: 'right' } }}>
            Last sync · {new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
