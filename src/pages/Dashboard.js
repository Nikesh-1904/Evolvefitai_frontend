// src/pages/Dashboard.js — Evolve / minimal dark redesign

import React, { useEffect, useMemo, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';
import { usePreferences } from '../contexts/PreferencesContext';
import { workoutService, analyticsService } from '../services/api';
import { ev } from '../theme/evolveDarkTheme';

const PAGE_X = 'clamp(28px, 6vw, 96px)';

// ---------- typographic atoms ----------

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

// ---------- presentational pieces ----------

function HeroAside({ name }) {
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const hh = String(time.getHours()).padStart(2, '0');
  const mm = String(time.getMinutes()).padStart(2, '0');
  const ss = String(time.getSeconds()).padStart(2, '0');

  return (
    <Box sx={{ textAlign: 'right', pb: '18px' }}>
      <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.25, ...monoLabel, letterSpacing: '0.24em' }}>
        <Box
          sx={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            backgroundColor: ev.accent,
            animation: 'ev-breathe 2.4s ease-in-out infinite',
          }}
        />
        Live · {greeting.toLowerCase()}, {name.split(' ')[0]}
      </Box>

      <Box
        sx={{
          ...display,
          fontSize: 'clamp(56px, 6.5vw, 96px)',
          lineHeight: 1,
          letterSpacing: '-0.03em',
          color: ev.chalk,
          mt: '18px',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {hh}
        <Box component="span" sx={{ color: ev.chalkMute, animation: 'ev-blink 1s steps(2,end) infinite' }}>:</Box>
        {mm}
        <Box component="span" sx={{ color: ev.chalkMute, animation: 'ev-blink 1s steps(2,end) infinite' }}>:</Box>
        {ss}
      </Box>

      <Box
        sx={{
          display: 'block',
          height: '1px',
          background: ev.chalk,
          ml: 'auto',
          mt: '28px',
          mb: '14px',
          width: 0,
          animation: 'ev-draw 1.4s cubic-bezier(.2,.7,.1,1) .2s forwards',
        }}
      />
      <Box sx={{ ...monoLabel, color: ev.chalkMute }}>
        {new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}
      </Box>
    </Box>
  );
}

function StatCell({ index, label, value, unit, sub, accent }) {
  return (
    <Box
      sx={{
        py: '56px',
        px: { xs: 3, md: '36px' },
        borderRight: { md: `1px solid ${ev.rule}` },
        borderBottom: { xs: `1px solid ${ev.rule}`, md: 'none' },
        '&:last-of-type': { borderRight: 'none' },
        '&:first-of-type': { pl: { md: 0 } },
        '&:last-of-type ': { pr: { md: 0 } },
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
          mt: '28px',
        }}
      >
        {value}
        {unit && (
          <Box component="span" sx={{ ...mono, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: ev.chalkMute, ml: '6px' }}>
            {unit}
          </Box>
        )}
      </Box>
      <Box sx={{ mt: '18px', ...mono, fontSize: 11, letterSpacing: '0.06em', color: accent || ev.chalkDim }}>
        {sub}
      </Box>
    </Box>
  );
}

function SectionHead({ title, italic, right }) {
  return (
    <Box
      sx={{
        display: { xs: 'block', md: 'grid' },
        gridTemplateColumns: '1fr 1fr',
        alignItems: 'end',
        mb: '56px',
      }}
    >
      <Box sx={{ ...display, fontSize: 'clamp(40px, 5vw, 64px)', lineHeight: 1, letterSpacing: '-0.02em', color: ev.chalk }}>
        {title}
        {italic && (
          <Box component="em" sx={{ fontStyle: 'italic', color: ev.chalkDim }}> {italic}</Box>
        )}
      </Box>
      {right && (
        <Box
          sx={{
            justifySelf: { md: 'end' },
            textAlign: { md: 'right' },
            mt: { xs: 2, md: 0 },
            display: 'grid',
            gap: '4px',
            ...monoMeta,
          }}
        >
          {right}
        </Box>
      )}
    </Box>
  );
}

function PlanRow({ idx, plan, onStart, onOpen, isLast }) {
  return (
    <Box
      onClick={onOpen}
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '30px 1fr auto', md: '40px 1fr 140px 24px' },
        gap: '28px',
        alignItems: 'baseline',
        py: '32px',
        borderTop: `1px solid ${ev.rule}`,
        borderBottom: isLast ? `1px solid ${ev.rule}` : 'none',
        cursor: 'pointer',
        transition: 'padding-left .2s ease',
        '&:hover': { pl: '12px', '& .row-mark': { color: ev.accent } },
      }}
    >
      <Box sx={{ ...mono, fontSize: 11, letterSpacing: '0.1em', color: ev.chalkMute }}>
        {String(idx).padStart(2, '0')}
      </Box>
      <Box>
        <Box sx={{ ...display, fontSize: 'clamp(22px, 2.4vw, 32px)', letterSpacing: '-0.01em', color: ev.chalk, lineHeight: 1.05 }}>
          {plan.name}
        </Box>
        <Box sx={{ ...monoLabel, color: ev.chalkMute, mt: '8px' }}>
          {plan.description?.slice(0, 64) || (plan.ai_generated ? 'AI generated · personalized' : 'manual plan')}
        </Box>
      </Box>
      <Box sx={{ ...mono, fontSize: 13, letterSpacing: '0.04em', color: ev.chalkDim, textAlign: { md: 'right' }, display: { xs: 'none', md: 'block' } }}>
        <Box
          component="span"
          onClick={(e) => { e.stopPropagation(); onStart(plan); }}
          sx={{
            cursor: 'pointer',
            color: ev.chalkDim,
            transition: 'color .15s ease',
            '&:hover': { color: ev.accent },
            ...mono,
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}
        >
          Begin →
        </Box>
      </Box>
      <Box className="row-mark" sx={{ ...mono, fontSize: 14, color: ev.chalkMute, justifySelf: 'end' }}>▸</Box>
    </Box>
  );
}

function EmptyState({ title, hint, cta, onCta }) {
  return (
    <Box sx={{ py: '64px', borderTop: `1px solid ${ev.rule}`, borderBottom: `1px solid ${ev.rule}`, textAlign: 'center' }}>
      <Box sx={{ ...display, fontSize: 28, color: ev.chalk, letterSpacing: '-0.01em' }}>{title}</Box>
      <Box sx={{ ...monoLabel, color: ev.chalkMute, mt: '14px' }}>{hint}</Box>
      {cta && (
        <Box
          onClick={onCta}
          sx={{
            display: 'inline-flex',
            mt: '28px',
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

function ReadyRow({ label, value, pct, tone }) {
  const fill =
    tone === 'good' ? ev.accent :
    tone === 'bad'  ? ev.chalkMute :
    ev.chalk;
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 180px 80px',
        gap: '18px',
        alignItems: 'baseline',
        py: '22px',
        borderTop: `1px solid ${ev.rule}`,
        '&:last-of-type': { borderBottom: `1px solid ${ev.rule}` },
        ...mono,
        fontSize: 12,
        letterSpacing: '0.06em',
        color: ev.chalkDim,
      }}
    >
      <Box>{label}</Box>
      <Box sx={{ position: 'relative', height: '1px', backgroundColor: ev.rule, top: '-5px' }}>
        <Box sx={{ position: 'absolute', top: '-1px', left: 0, height: '3px', width: `${pct}%`, backgroundColor: fill }} />
      </Box>
      <Box sx={{ color: ev.chalk, fontWeight: 500, textAlign: 'right' }}>{value}</Box>
    </Box>
  );
}

// ---------- the page ----------

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { convertWeight, convertHeight, getUnitLabel } = usePreferences();

  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [logs, plans, statsData] = await Promise.all([
        workoutService.getWorkoutLogs(),
        workoutService.getWorkoutPlans(),
        analyticsService.getDashboardOverview(),
      ]);
      setRecentWorkouts(logs.slice(0, 3));
      setWorkoutPlans(plans.slice(0, 3));
      setStats(statsData);
    } catch (error) {
      // surface upstream; do not swallow silently
      // eslint-disable-next-line no-console
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = () => navigate('/generate-workout');
  const handleStartPlan = (plan) => plan && navigate('/workout-session', { state: { workoutPlan: plan } });

  if (loading) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '60vh', gap: 2 }}>
        <CircularProgress size={28} />
        <Box sx={{ ...monoLabel }}>Loading dashboard</Box>
      </Box>
    );
  }

  const userName = user?.full_name || user?.email?.split('@')[0] || 'athlete';

  const calChange = stats?.calories_change_percent ?? 0;
  const timeChange = stats?.time_change_percent ?? 0;

  // synth a readiness narrative from available stats (gracefully degrades)
  const level = stats?.level_progress?.current_level ?? 1;
  const completed = stats?.workouts_completed ?? 0;

  return (
    <Box sx={{ animation: 'ev-rise .5s ease both' }}>

      {/* ============ HERO ============ */}
      <Box sx={{ px: PAGE_X, pt: 'clamp(80px, 14vh, 180px)', pb: 'clamp(60px, 10vh, 120px)', display: 'grid', gap: '64px' }}>
        <Box sx={{ ...monoLabel, display: 'flex', gap: '14px', alignItems: 'center', color: ev.chalkDim }}>
          <Box component="span" sx={{ color: ev.chalkMute }}>Today</Box>
          <Box component="b" sx={{ color: ev.chalk, fontWeight: 400 }}>/</Box>
          <Box component="span" sx={{ color: ev.chalkMute }}>Welcome back, {userName.split(' ')[0]}</Box>
          <Box component="b" sx={{ color: ev.chalk, fontWeight: 400 }}>/</Box>
          <Box component="span" sx={{ color: ev.chalkMute }}>Level {level} · {completed} sessions logged</Box>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'minmax(0,1fr) auto' }, gap: 'clamp(48px, 8vw, 140px)', alignItems: 'end' }}>
          <Box
            component="h1"
            sx={{
              ...display,
              m: 0,
              fontWeight: 400,
              fontSize: 'clamp(80px, 12vw, 180px)',
              lineHeight: 0.88,
              letterSpacing: '-0.025em',
              color: ev.chalk,
              maxWidth: '14ch',
            }}
          >
            Train<Box component="span" sx={{ color: ev.accent, fontStyle: 'normal' }}>.</Box>
            <br />
            <Box component="em" sx={{ fontStyle: 'italic', color: ev.chalkDim }}>today</Box>
          </Box>

          <HeroAside name={userName} />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr auto' }, gap: '48px', alignItems: 'end', pt: '32px', borderTop: `1px solid ${ev.rule}` }}>
          <Box sx={{ maxWidth: '44ch', fontSize: 15, lineHeight: 1.55, color: ev.chalkDim, fontWeight: 300 }}>
            {(!user?.fitness_goal || !user?.experience_level)
              ? 'Your profile is incomplete. Finish onboarding to unlock personalized programming and live coaching feedback.'
              : 'A clean canvas. Pick up an existing plan, generate something new, or freestyle a session and log it as you go.'}
          </Box>
          <Box
            onClick={handleGenerate}
            sx={{
              justifySelf: { md: 'end' },
              display: 'inline-flex',
              alignItems: 'baseline',
              gap: '14px',
              ...mono,
              fontSize: 12,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: ev.chalk,
              borderBottom: `1px solid ${ev.chalk}`,
              pb: '4px',
              cursor: 'pointer',
              transition: 'color .2s ease, border-color .2s ease',
              '&:hover': { color: ev.accent, borderColor: ev.accent },
            }}
          >
            Generate workout <Box component="span" sx={{ ...display, fontStyle: 'italic', fontSize: 18 }}>↗</Box>
          </Box>
        </Box>
      </Box>

      {/* ============ STAT QUAD ============ */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          px: PAGE_X,
          borderTop: `1px solid ${ev.rule}`,
        }}
      >
        <StatCell
          index={1}
          label="Calories · today"
          value={(stats?.total_calories_burned ?? 0).toLocaleString()}
          unit="kcal"
          sub={<>{calChange >= 0 ? '▲' : '▼'} <Box component="b" sx={{ color: calChange >= 0 ? ev.accent : ev.warn, fontWeight: 500 }}>{Math.abs(calChange).toFixed(0)}%</Box> vs prior</>}
        />
        <StatCell
          index={2}
          label="Workout time · today"
          value={`${stats?.total_workout_time_hours ?? 0}`}
          unit="hr"
          sub={<>{timeChange >= 0 ? '▲' : '▼'} <Box component="b" sx={{ color: timeChange >= 0 ? ev.accent : ev.warn, fontWeight: 500 }}>{Math.abs(timeChange).toFixed(0)}%</Box> vs prior</>}
        />
        <StatCell
          index={3}
          label="Total workouts"
          value={completed}
          sub={<>Across <Box component="b" sx={{ color: ev.chalk, fontWeight: 500 }}>{workoutPlans.length || 'all'}</Box> active plans</>}
        />
        <StatCell
          index={4}
          label="Fitness level"
          value={String(level).padStart(2, '0')}
          sub={<>Tier · <Box component="b" sx={{ color: ev.chalk, fontWeight: 500 }}>progressing</Box></>}
        />
      </Box>

      {/* ============ YOUR PLANS ============ */}
      <Box sx={{ px: PAGE_X, py: 'clamp(80px, 12vh, 140px)', borderTop: `1px solid ${ev.rule}` }}>
        <SectionHead
          title="Your"
          italic="plans"
          right={
            <>
              <Box>{workoutPlans.length} active · <Box component="b" sx={{ color: ev.chalk, fontWeight: 500 }}>{stats?.workouts_completed ?? 0} sessions</Box> logged</Box>
              <Box
                onClick={() => navigate('/workout-history')}
                sx={{ cursor: 'pointer', color: ev.chalkDim, transition: 'color .2s ease', '&:hover': { color: ev.accent } }}
              >
                View full history →
              </Box>
            </>
          }
        />

        {workoutPlans.length === 0 ? (
          <EmptyState
            title="No plans yet"
            hint="Generate your first AI-powered workout to get started"
            cta="Create first plan ↗"
            onCta={handleGenerate}
          />
        ) : (
          <Box>
            {workoutPlans.map((plan, i) => (
              <PlanRow
                key={plan.id}
                idx={i + 1}
                plan={plan}
                onStart={handleStartPlan}
                onOpen={() => navigate(`/workout-plan/${plan.id}`)}
                isLast={i === workoutPlans.length - 1}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* ============ COACH + READINESS ============ */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1.4fr 1fr' },
          borderTop: `1px solid ${ev.rule}`,
        }}
      >
        <Box sx={{ px: PAGE_X, py: 'clamp(70px, 10vh, 120px)', borderRight: { md: `1px solid ${ev.rule}` }, borderBottom: { xs: `1px solid ${ev.rule}`, md: 'none' } }}>
          <Box sx={{ ...monoLabel, mb: '36px' }}>Coach · real-time</Box>
          <Box component="blockquote" sx={{ ...display, m: 0, fontStyle: 'italic', fontSize: 'clamp(28px, 3.4vw, 44px)', lineHeight: 1.18, letterSpacing: '-0.015em', color: ev.chalk, maxWidth: '22ch' }}>
            "Consistency is compounding. You've trained <Box component="span" sx={{ fontStyle: 'normal', color: ev.accent }}>{completed}</Box> sessions — keep showing up."
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: '40px', ...monoLabel, color: ev.chalkMute }}>
            <Box>Model · <Box component="b" sx={{ color: ev.chalk, fontWeight: 500 }}>EvolveCoach v3</Box></Box>
            <Box>{new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</Box>
          </Box>
        </Box>

        <Box sx={{ px: PAGE_X, py: 'clamp(70px, 10vh, 120px)' }}>
          <Box sx={{ ...monoLabel, mb: '36px' }}>Readiness</Box>
          <Box>
            <ReadyRow label="Plans active"  value={workoutPlans.length}                                    pct={Math.min(workoutPlans.length * 25, 100)} tone="good" />
            <ReadyRow label="Sessions logged" value={completed}                                            pct={Math.min(completed * 4, 100)}            tone="good" />
            <ReadyRow label="Profile"        value={(user?.fitness_goal && user?.experience_level) ? 'Complete' : 'Partial'} pct={(user?.fitness_goal && user?.experience_level) ? 100 : 50} tone={(user?.fitness_goal && user?.experience_level) ? 'good' : 'bad'} />
            <ReadyRow label="Current level"  value={`Lv ${level}`}                                         pct={Math.min(level * 10, 100)}               tone="neutral" />
          </Box>
        </Box>
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
                Open log →
              </Box>
            </>
          }
        />

        {recentWorkouts.length === 0 ? (
          <EmptyState
            title="Nothing logged yet"
            hint="Complete your first workout to see it here"
          />
        ) : (
          <Box>
            {recentWorkouts.map((w, i) => {
              const exerciseCount = Array.isArray(w.exercises_completed)
                ? w.exercises_completed.length
                : (typeof w.exercises_completed === 'number' ? w.exercises_completed : 0);
              return (
                <Box
                  key={i}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '30px 1fr auto', md: '40px 1fr 140px 140px 24px' },
                    gap: '28px',
                    alignItems: 'baseline',
                    py: '32px',
                    borderTop: `1px solid ${ev.rule}`,
                    borderBottom: i === recentWorkouts.length - 1 ? `1px solid ${ev.rule}` : 'none',
                  }}
                >
                  <Box sx={{ ...mono, fontSize: 11, letterSpacing: '0.1em', color: ev.chalkMute }}>{String(i + 1).padStart(2, '0')}</Box>
                  <Box>
                    <Box sx={{ ...display, fontSize: 'clamp(22px, 2vw, 28px)', letterSpacing: '-0.01em', color: ev.chalk, lineHeight: 1.05 }}>
                      {new Date(w.workout_date).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' })}
                    </Box>
                    <Box sx={{ ...monoLabel, color: ev.chalkMute, mt: '8px' }}>session log</Box>
                  </Box>
                  <Box sx={{ ...mono, fontSize: 13, color: ev.chalkDim, textAlign: { md: 'right' }, display: { xs: 'none', md: 'block' } }}>
                    {w.duration_minutes || '—'} <Box component="span" sx={{ color: ev.chalkMute }}>min</Box>
                  </Box>
                  <Box sx={{ ...mono, fontSize: 13, color: ev.chalkDim, textAlign: { md: 'right' }, display: { xs: 'none', md: 'block' } }}>
                    {exerciseCount} <Box component="span" sx={{ color: ev.chalkMute }}>movements</Box>
                  </Box>
                  <Box sx={{ ...mono, fontSize: 14, color: ev.chalkMute, justifySelf: 'end' }}>·</Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>

      {/* ============ PROFILE STRIP ============ */}
      {(user?.weight || user?.height) && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            px: PAGE_X,
            py: 'clamp(80px, 10vh, 120px)',
            borderTop: `1px solid ${ev.rule}`,
            gap: { xs: '32px', md: '64px' },
            alignItems: 'end',
          }}
        >
          {user?.weight && (
            <Box>
              <Box sx={monoLabel}>Body weight</Box>
              <Box sx={{ ...display, fontSize: 'clamp(48px, 5vw, 72px)', lineHeight: 0.95, color: ev.chalk, letterSpacing: '-0.025em', mt: '18px' }}>
                {convertWeight(user.weight)}
                <Box component="em" sx={{ ...display, fontStyle: 'italic', color: ev.chalkDim, fontSize: '0.4em', verticalAlign: 'top', ml: '6px' }}>
                  {getUnitLabel('weight')}
                </Box>
              </Box>
            </Box>
          )}
          {user?.height && (
            <Box>
              <Box sx={monoLabel}>Height</Box>
              <Box sx={{ ...display, fontSize: 'clamp(48px, 5vw, 72px)', lineHeight: 0.95, color: ev.chalk, letterSpacing: '-0.025em', mt: '18px' }}>
                {convertHeight(user.height)}
              </Box>
            </Box>
          )}
          <Box sx={{ justifySelf: { md: 'end' }, textAlign: { md: 'right' } }}>
            <Box sx={{ ...monoLabel, mb: '14px' }}>Profile</Box>
            <Box
              onClick={() => navigate('/profile')}
              sx={{
                display: 'inline-flex',
                cursor: 'pointer',
                ...mono,
                fontSize: 12,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: ev.chalk,
                borderBottom: `1px solid ${ev.chalk}`,
                pb: '4px',
                '&:hover': { color: ev.accent, borderColor: ev.accent },
              }}
            >
              Edit profile ↗
            </Box>
          </Box>
        </Box>
      )}

      {/* ============ WORDMARK ============ */}
      <Box sx={{ px: PAGE_X, pt: 'clamp(120px, 18vh, 220px)', pb: '64px', borderTop: `1px solid ${ev.rule}` }}>
        <Box sx={{ ...display, fontSize: 'clamp(140px, 22vw, 320px)', lineHeight: 0.84, letterSpacing: '-0.04em', color: ev.chalk, m: 0 }}>
          evolve<Box component="span" sx={{ color: ev.accent, fontStyle: 'normal' }}>.</Box>
        </Box>
        <Box sx={{ mt: '64px', display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: '32px', pt: '28px', borderTop: `1px solid ${ev.rule}`, ...monoLabel, color: ev.chalkMute }}>
          <Box><Box component="b" sx={{ color: ev.chalk, fontWeight: 500 }}>Build 2026.05</Box></Box>
          <Box>Coach model · v3 · all systems operational</Box>
          <Box sx={{ justifySelf: { md: 'end' }, textAlign: { md: 'right' } }}>
            Last sync · {new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
