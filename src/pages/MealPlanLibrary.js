// src/pages/MealPlanLibrary.js - View Saved Meal Plans

import React, { useState } from 'react';
import {
  Typography,
  Box,
  Grid,
  Chip,
  Stack,
  IconButton,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Restaurant,
  LocalFireDepartment,
  ExpandMore,
  ExpandLess,
  Delete,
  Refresh,
  Coffee,
  LocalDining,
  Fastfood,
  RestaurantMenu,
} from '@mui/icons-material';
import { PageContainer } from '../components/design-system';
import { Alert, EmptyState, Loading } from '../components/design-system';
import ModernCard, { StatCard } from '../components/ModernCard';
import AIModelBadge from '../components/AIModelBadge';
import { useMealPlans } from '../hooks/useMeals';

// Get meal icon based on type
const getMealIcon = (mealType) => {
  const type = mealType?.toLowerCase() || '';
  if (type.includes('breakfast')) return <Coffee />;
  if (type.includes('lunch')) return <LocalDining />;
  if (type.includes('dinner')) return <Restaurant />;
  if (type.includes('snack')) return <Fastfood />;
  return <RestaurantMenu />;
};

// Individual Meal Plan Card Component
const MealPlanCard = ({ plan }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <ModernCard variant="glass">
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography
              variant="h6"
              sx={{
                color: '#FFFFFF',
                fontWeight: 600,
                mb: 0.5,
              }}
            >
              {plan.name}
            </Typography>
            <Typography variant="caption" sx={{ color: '#94A3B8' }}>
              Created: {new Date(plan.created_at).toLocaleDateString()}
            </Typography>
          </Box>
          {plan.ai_generated && <AIModelBadge model={plan.ai_model} />}
        </Box>

        {/* Macro Stats */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6} sm={3}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: '12px',
                background: 'rgba(0, 212, 255, 0.1)',
                border: '1px solid rgba(0, 212, 255, 0.2)',
                textAlign: 'center',
              }}
            >
              <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                Calories
              </Typography>
              <Typography variant="h6" sx={{ color: '#00D4FF', fontWeight: 600 }}>
                {plan.target_calories || 'N/A'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: '12px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                textAlign: 'center',
              }}
            >
              <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                Protein
              </Typography>
              <Typography variant="h6" sx={{ color: '#EF4444', fontWeight: 600 }}>
                {plan.target_protein ? `${plan.target_protein}g` : 'N/A'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                textAlign: 'center',
              }}
            >
              <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                Carbs
              </Typography>
              <Typography variant="h6" sx={{ color: '#10B981', fontWeight: 600 }}>
                {plan.target_carbs ? `${plan.target_carbs}g` : 'N/A'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: '12px',
                background: 'rgba(251, 191, 36, 0.1)',
                border: '1px solid rgba(251, 191, 36, 0.2)',
                textAlign: 'center',
              }}
            >
              <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                Fat
              </Typography>
              <Typography variant="h6" sx={{ color: '#FBBF24', fontWeight: 600 }}>
                {plan.target_fat ? `${plan.target_fat}g` : 'N/A'}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Expand/Collapse Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <IconButton
            onClick={() => setExpanded(!expanded)}
            sx={{
              color: '#00D4FF',
              '&:hover': {
                background: 'rgba(0, 212, 255, 0.1)',
              },
            }}
          >
            {expanded ? <ExpandLess /> : <ExpandMore />}
            <Typography variant="body2" sx={{ ml: 1 }}>
              {expanded ? 'Hide Meals' : 'View Meals'}
            </Typography>
          </IconButton>
        </Box>

        {/* Meal Details */}
        <Collapse in={expanded}>
          <Box sx={{ mt: 3 }}>
            <Stack spacing={2}>
              {plan.meals && Object.entries(plan.meals).map(([mealType, mealData]) => (
                <Box
                  key={mealType}
                  sx={{
                    p: 2,
                    borderRadius: '12px',
                    background: 'rgba(30, 41, 59, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                    {getMealIcon(mealType)}
                    <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                      {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                    </Typography>
                  </Box>

                  {/* Foods */}
                  {mealData.foods && (
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#CBD5E1', fontWeight: 500, mb: 0.5 }}>
                        Foods:
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                        {Array.isArray(mealData.foods) ? mealData.foods.join(', ') : mealData.foods}
                      </Typography>
                    </Box>
                  )}

                  {/* Instructions */}
                  {mealData.instructions && (
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#CBD5E1', fontWeight: 500, mb: 0.5 }}>
                        Instructions:
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                        {mealData.instructions}
                      </Typography>
                    </Box>
                  )}

                  {/* Macros */}
                  <Box sx={{ display: 'flex', gap: 2, mt: 1.5, flexWrap: 'wrap' }}>
                    {mealData.calories && (
                      <Chip
                        icon={<LocalFireDepartment sx={{ fontSize: '16px' }} />}
                        label={`${mealData.calories} cal`}
                        size="small"
                        sx={{
                          background: 'rgba(0, 212, 255, 0.1)',
                          color: '#00D4FF',
                          border: '1px solid rgba(0, 212, 255, 0.2)',
                        }}
                      />
                    )}
                    {mealData.protein && (
                      <Chip
                        label={`${mealData.protein}g protein`}
                        size="small"
                        sx={{
                          background: 'rgba(239, 68, 68, 0.1)',
                          color: '#EF4444',
                          border: '1px solid rgba(239, 68, 68, 0.2)',
                        }}
                      />
                    )}
                    {mealData.carbs && (
                      <Chip
                        label={`${mealData.carbs}g carbs`}
                        size="small"
                        sx={{
                          background: 'rgba(16, 185, 129, 0.1)',
                          color: '#10B981',
                          border: '1px solid rgba(16, 185, 129, 0.2)',
                        }}
                      />
                    )}
                    {mealData.fat && (
                      <Chip
                        label={`${mealData.fat}g fat`}
                        size="small"
                        sx={{
                          background: 'rgba(251, 191, 36, 0.1)',
                          color: '#FBBF24',
                          border: '1px solid rgba(251, 191, 36, 0.2)',
                        }}
                      />
                    )}
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>
        </Collapse>
      </Box>
    </ModernCard>
  );
};

function MealPlanLibrary() {
  const { data: mealPlansData, loading, error, execute: refetch } = useMealPlans();

  const mealPlans = mealPlansData?.meal_plans || [];

  return (
    <PageContainer
      title="My Meal Plans"
      subtitle="View and manage your saved meal plans"
      icon="📚"
      maxWidth="lg"
    >
      {/* Error Message */}
      {error && (
        <Alert severity="error" closable sx={{ mb: 3 }}>
          {error.message || 'Failed to load meal plans'}
        </Alert>
      )}

      {/* Refresh Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <IconButton
          onClick={refetch}
          disabled={loading}
          sx={{
            color: '#00D4FF',
            '&:hover': {
              background: 'rgba(0, 212, 255, 0.1)',
            },
          }}
        >
          <Refresh />
        </IconButton>
      </Box>

      {/* Loading State */}
      {loading ? (
        <Loading />
      ) : mealPlans.length === 0 ? (
        <EmptyState
          type="meal"
          title="No Saved Meal Plans"
          description="Generate and save meal plans to see them here"
          action={{
            label: "Generate Meal Plan",
            onClick: () => (window.location.href = '/meal-plan-generator')
          }}
        />
      ) : (
        <Stack spacing={3}>
          {mealPlans.map((plan) => (
            <MealPlanCard key={plan.id} plan={plan} />
          ))}
        </Stack>
      )}
    </PageContainer>
  );
}

export default MealPlanLibrary;
