import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Alert,
  Chip,
} from '@mui/material';
import { AccountCircle, Save } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

function Profile() {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    age: '',
    weight: '',
    height: '',
    gender: '',
    fitness_goal: '',
    experience_level: '',
    activity_level: '',
    dietary_restrictions: [],
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        username: user.username || '',
        age: user.age || '',
        weight: user.weight || '',
        height: user.height || '',
        gender: user.gender || '',
        fitness_goal: user.fitness_goal || '',
        experience_level: user.experience_level || '',
        activity_level: user.activity_level || '',
        dietary_restrictions: user.dietary_restrictions || [],
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDietaryRestrictionToggle = (restriction) => {
    setFormData(prev => ({
      ...prev,
      dietary_restrictions: prev.dietary_restrictions.includes(restriction)
        ? prev.dietary_restrictions.filter(r => r !== restriction)
        : [...prev.dietary_restrictions, restriction]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    // Clean up data - convert empty strings to null for numbers
    const cleanData = { ...formData };
    if (cleanData.age === '') cleanData.age = null;
    if (cleanData.weight === '') cleanData.weight = null;
    if (cleanData.height === '') cleanData.height = null;
    
    // Convert string numbers to actual numbers
    if (cleanData.age) cleanData.age = parseInt(cleanData.age);
    if (cleanData.weight) cleanData.weight = parseFloat(cleanData.weight);
    if (cleanData.height) cleanData.height = parseFloat(cleanData.height);

    const result = await updateProfile(cleanData);

    if (result.success) {
      setMessage('Profile updated successfully!');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const fitnessGoals = [
    'weight_loss',
    'muscle_gain',
    'strength',
    'endurance',
    'general_fitness'
  ];

  const experienceLevels = [
    'beginner',
    'intermediate',
    'advanced'
  ];

  const activityLevels = [
    'sedentary',
    'lightly_active',
    'moderate',
    'very_active',
    'extremely_active'
  ];

  const commonDietaryRestrictions = [
    'vegetarian',
    'vegan',
    'gluten_free',
    'dairy_free',
    'keto',
    'paleo',
    'halal',
    'kosher'
  ];

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <AccountCircle sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
        <Typography variant="h4">
          Profile Settings
        </Typography>
      </Box>

      {message && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setMessage('')}>
          {message}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
            
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={user?.email || ''}
                  disabled
                  helperText="Email cannot be changed"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  inputProps={{ min: 13, max: 120 }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Weight (kg)"
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleChange}
                  inputProps={{ min: 30, max: 300, step: 0.1 }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Height (cm)"
                  name="height"
                  type="number"
                  value={formData.height}
                  onChange={handleChange}
                  inputProps={{ min: 100, max: 250 }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    label="Gender"
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                    <MenuItem value="prefer_not_to_say">Prefer not to say</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom>
              Fitness Profile
            </Typography>
            
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Fitness Goal</InputLabel>
                  <Select
                    name="fitness_goal"
                    value={formData.fitness_goal}
                    onChange={handleChange}
                    label="Fitness Goal"
                  >
                    {fitnessGoals.map(goal => (
                      <MenuItem key={goal} value={goal}>
                        {goal.replace('_', ' ').replace(/\\b\\w/g, l => l.toUpperCase())}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Experience Level</InputLabel>
                  <Select
                    name="experience_level"
                    value={formData.experience_level}
                    onChange={handleChange}
                    label="Experience Level"
                  >
                    {experienceLevels.map(level => (
                      <MenuItem key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Activity Level</InputLabel>
                  <Select
                    name="activity_level"
                    value={formData.activity_level}
                    onChange={handleChange}
                    label="Activity Level"
                  >
                    {activityLevels.map(level => (
                      <MenuItem key={level} value={level}>
                        {level.replace('_', ' ').replace(/\\b\\w/g, l => l.toUpperCase())}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom>
              Dietary Restrictions
            </Typography>
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Select any dietary restrictions that apply to you:
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {commonDietaryRestrictions.map(restriction => (
                  <Chip
                    key={restriction}
                    label={restriction.replace('_', ' ').replace(/\\b\\w/g, l => l.toUpperCase())}
                    clickable
                    color={formData.dietary_restrictions.includes(restriction) ? 'primary' : 'default'}
                    onClick={() => handleDietaryRestrictionToggle(restriction)}
                  />
                ))}
              </Box>
            </Box>

            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<Save />}
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default Profile;