// src/pages/Analytics.js

import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, CircularProgress, Alert, ToggleButtonGroup, ToggleButton } from '@mui/material';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import apiService from '../services/apiService';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [aggregation, setAggregation] = useState('day');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // We will need to add this function to apiService.js
        const data = await apiService.getAnalyticsData(aggregation);
        setAnalyticsData(data);
      } catch (err) {
        setError('Failed to load analytics data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [aggregation]);

  const handleAggregationChange = (event, newAggregation) => {
    if (newAggregation !== null) {
      setAggregation(newAggregation);
    }
  };

  const today = new Date();
  const oneYearAgo = new Date(new Date().setFullYear(today.getFullYear() - 1));

  const heatmapValues = analyticsData?.workout_heatmap.map(dateStr => ({
    date: new Date(dateStr),
    count: 1, // Simple count for presence of a workout
  })) || [];

  const chartData = {
    labels: analyticsData?.calorie_timeseries.map(d => new Date(d.date).toLocaleDateString()) || [],
    datasets: [
      {
        label: 'Calories Burned',
        data: analyticsData?.calorie_timeseries.map(d => d.value) || [],
        borderColor: '#00D4FF',
        backgroundColor: 'rgba(0, 212, 255, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Container sx={{ py: 4 }}><Alert severity="error">{error}</Alert></Container>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Your Analytics</Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Workout Consistency (Last Year)</Typography>
        <CalendarHeatmap
          startDate={oneYearAgo}
          endDate={today}
          values={heatmapValues}
          classForValue={(value) => {
            if (!value) return 'color-empty';
            return 'color-filled';
          }}
          tooltipDataAttrs={value => ({ 'data-tip': `${value.date ? new Date(value.date).toLocaleDateString() : ''}` })}
        />
        <style>{`
          .react-calendar-heatmap .color-filled { fill: #10B981; }
        `}</style>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Calories Burned</Typography>
          <ToggleButtonGroup
            value={aggregation}
            exclusive
            onChange={handleAggregationChange}
            size="small"
          >
            <ToggleButton value="day">Day</ToggleButton>
            <ToggleButton value="week">Week</ToggleButton>
            <ToggleButton value="month">Month</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Line data={chartData} />
      </Paper>
    </Container>
  );
};

export default Analytics;