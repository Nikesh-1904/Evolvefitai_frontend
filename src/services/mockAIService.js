// src/services/mockAIService.js - Mock AI Service for Development

/**
 * Mock AI service that provides sample data when backend endpoints are not available
 * This allows frontend development to continue while backend AI features are being implemented
 */

class MockAIService {
  /**
   * Mock meal photo analysis
   */
  async analyzeMealPhoto(imageBase64) {
    // Simulate API delay
    await this.delay(2000);

    return {
      meal_name: "Grilled Chicken Salad",
      description: "Fresh mixed greens with grilled chicken breast, cherry tomatoes, and vinaigrette",
      nutrition: {
        calories: 420,
        protein: 38,
        carbs: 28,
        fats: 18
      },
      ingredients: [
        "Chicken breast",
        "Mixed greens",
        "Cherry tomatoes",
        "Cucumber",
        "Olive oil",
        "Balsamic vinegar"
      ],
      recommendations: "Great protein-rich meal! Consider adding some complex carbs like quinoa or sweet potato for sustained energy during your workouts."
    };
  }

  /**
   * Mock exercise form analysis
   */
  async analyzeExerciseForm(videoBlob) {
    // Simulate API delay
    await this.delay(3000);

    return {
      exercise_name: "Squat",
      overall_score: 75,
      issues: [
        {
          severity: "warning",
          title: "Knee Alignment",
          description: "Your knees are tracking slightly inward. Focus on pushing your knees out to align with your toes."
        },
        {
          severity: "info",
          title: "Depth",
          description: "Good depth! You're reaching parallel consistently. Consider going slightly deeper if mobility allows."
        },
        {
          severity: "good",
          title: "Back Position",
          description: "Excellent neutral spine throughout the movement. Keep this up!"
        }
      ],
      recommendations: [
        "Focus on external rotation cues - 'spread the floor' with your feet",
        "Practice goblet squats to improve knee tracking",
        "Continue maintaining that strong core engagement",
        "Consider adding pause squats to work on positioning"
      ]
    };
  }

  /**
   * Mock predictive analytics
   */
  async getPredictiveAnalytics() {
    // Simulate API delay
    await this.delay(1500);

    const today = new Date();
    const historicalData = [];
    const futureData = [];

    // Generate historical data (last 30 days)
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      historicalData.push({
        date: date.toISOString().split('T')[0],
        value: 70 + Math.random() * 10 + (30 - i) * 0.5 // Upward trend
      });
    }

    // Generate future predictions (next 30 days)
    const lastValue = historicalData[historicalData.length - 1].value;
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const predictedValue = lastValue + i * 0.6 + Math.random() * 3;
      futureData.push({
        date: date.toISOString().split('T')[0],
        value: predictedValue,
        upper_bound: predictedValue + 5 + Math.random() * 3,
        lower_bound: Math.max(predictedValue - 5 - Math.random() * 3, 0)
      });
    }

    return {
      predicted_improvement: 12.5,
      trend: "Improving",
      goal_achievement_date: new Date(today.setDate(today.getDate() + 45)).toLocaleDateString(),
      consistency_score: 85,
      historical_data: historicalData,
      future_performance: futureData,
      insights: [
        {
          title: "Strong Consistency Pattern",
          description: "You've maintained a 5-day per week workout schedule for the past month. This consistency is driving your progress."
        },
        {
          title: "Progressive Overload Detected",
          description: "Your strength metrics show a steady 2-3% weekly increase, indicating effective progressive overload."
        },
        {
          title: "Recovery Optimization",
          description: "Your rest days are well-distributed, allowing for optimal recovery between sessions."
        }
      ],
      recommendations: [
        {
          priority: "high",
          title: "Increase Volume for Upper Body",
          action: "Add 2-3 more sets to your push exercises. Your lower body is progressing faster than upper body."
        },
        {
          priority: "normal",
          title: "Maintain Current Protein Intake",
          action: "Your current protein consumption (1.8g/kg) is optimal for muscle growth. Keep it up!"
        },
        {
          priority: "normal",
          title: "Consider Deload Week",
          action: "Plan a deload week in 2-3 weeks to prevent overtraining and optimize recovery."
        }
      ],
      goal_progress: [
        {
          goal_name: "Bench Press 225 lbs",
          current_progress: 72,
          estimated_completion_date: "March 15, 2025"
        },
        {
          goal_name: "Squat 315 lbs",
          current_progress: 85,
          estimated_completion_date: "February 20, 2025"
        }
      ]
    };
  }

  /**
   * Utility delay function
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

const mockAIService = new MockAIService();
export default mockAIService;
