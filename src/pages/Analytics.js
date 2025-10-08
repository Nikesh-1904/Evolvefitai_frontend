// src/pages/Analytics.js

import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, CircularProgress, Alert, ToggleButtonGroup, ToggleButton, Autocomplete, TextField } from '@mui/material';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import apiService from '../services/apiService';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [aggregation, setAggregation] = useState('day');

  // State for the new progression chart
  const [exerciseList, setExerciseList] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [progressionData, setProgressionData] = useState(null);
  const [progressionLoading, setProgressionLoading] = useState(false);

  // Effect for the main analytics data (heatmap & calorie chart)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [data, exercises] = await Promise.all([
          apiService.getAnalyticsData(aggregation),
          apiService.getLoggedExercises()
        ]);
        setAnalyticsData(data);
        setExerciseList(exercises);
      } catch (err) {
        setError('Failed to load analytics data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [aggregation]);

  // Effect to fetch progression data when an exercise is selected
  useEffect(() => {
    if (selectedExercise) {
      const fetchProgressionData = async () => {
        setProgressionLoading(true);
        setProgressionData(null);
        try {
          const data = await apiService.getExerciseProgression(selectedExercise);
          setProgressionData(data);
        } catch (err) {
          console.error("Failed to fetch progression data:", err);
        } finally {
          setProgressionLoading(false);
        }
      };
      fetchProgressionData();
    }
  }, [selectedExercise]);

  const handleAggregationChange = (event, newAggregation) => {
    if (newAggregation !== null) {
      setAggregation(newAggregation);
    }
  };

  const today = new Date();
  const oneYearAgo = new Date(new Date().setFullYear(today.getFullYear() - 1));

  const heatmapValues = analyticsData?.workout_heatmap.map(dateStr => ({ date: new Date(dateStr) })) || [];
  
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
  
  const progressionChartData = {
    labels: progressionData?.map(d => new Date(d.workout_date).toLocaleDateString()) || [],
    datasets: [{
      label: 'Total Volume (kg)',
      data: progressionData?.map(d => d.total_volume) || [],
      borderColor: '#7C3AED',
      backgroundColor: 'rgba(124, 58, 237, 0.2)',
      fill: true,
      tension: 0.4,
    }],
  };
  
  const progressionChartOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          footer: function(tooltipItems) {
            const dataIndex = tooltipItems[0].dataIndex;
            const sets = progressionData[dataIndex].sets;
            return sets.map(set => `  - ${set.reps} reps @ ${set.weight} kg`);
          }
        }
      }
    }
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
          classForValue={(value) => !value ? 'color-empty' : 'color-filled'}
          tooltipDataAttrs={value => ({ 'data-tip': `${value.date ? new Date(value.date).toLocaleDateString() : 'No workouts'}` })}
        />
        <style>{`.react-calendar-heatmap .color-filled { fill: #10B981; }`}</style>
      </Paper>

      <Paper sx={{ p: 3, mb: 4 }}>
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

      {/* --- START: NEW PROGRESSION CHART SECTION --- */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Exercise Progression</Typography>
        <Autocomplete
          options={exerciseList}
          value={selectedExercise}
          onChange={(event, newValue) => {
            setSelectedExercise(newValue);
          }}
          renderInput={(params) => <TextField {...params} label="Select an Exercise" />}
          sx={{ mb: 3 }}
        />
        {progressionLoading && <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>}
        
        {progressionData && progressionData.length > 0 && (
          <Line data={progressionChartData} options={progressionChartOptions} />
        )}
        
        {progressionData && progressionData.length === 0 && !progressionLoading && (
           <Typography color="text.secondary">No logged data found for this exercise.</Typography>
        )}

        {!selectedExercise && !progressionLoading && (
          <Typography color="text.secondary">Select an exercise above to see your progress.</Typography>
        )}
      </Paper>
      {/* --- END: NEW PROGRESSION CHART SECTION --- */}

    </Container>
  );
};

export default Analytics;