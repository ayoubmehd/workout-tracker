"use client";

import React, { useState } from 'react';
import type { CompletedWorkout } from '~/types';
import { BarChart as BarChartIcon, Activity, Calendar, Clock, Dumbbell } from 'lucide-react';

const Stats: React.FC = () => {
  const [completedWorkouts, setCompletedWorkouts] = useState<CompletedWorkout[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');
  
  // Calculate total stats
  const totalWorkouts = completedWorkouts.length;
  const totalExercises = completedWorkouts.reduce(
    (count, workout) => count + workout.exercises.length, 
    0
  );
  const totalDuration = completedWorkouts.reduce(
    (total, workout) => total + workout.duration, 
    0
  );
  
  // Format time function
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };
  
  // Filter workouts based on selected period
  const getFilteredWorkouts = () => {
    const now = new Date();
    const startDate = new Date();
    
    if (selectedPeriod === 'week') {
      startDate.setDate(now.getDate() - 7);
    } else if (selectedPeriod === 'month') {
      startDate.setMonth(now.getMonth() - 1);
    } else {
      startDate.setFullYear(now.getFullYear() - 1);
    }
    
    return completedWorkouts.filter(workout => 
      new Date(workout.completedAt) >= startDate
    );
  };
  
  // Generate chart data
  const generateChartData = () => {
    const filteredWorkouts = getFilteredWorkouts();
    const data: Record<string, number> = {};
    
    if (selectedPeriod === 'week') {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayStr = date.toLocaleDateString('en-US', { weekday: 'short' });
        data[dayStr] = 0;
      }
      
      filteredWorkouts.forEach(workout => {
        const date = new Date(workout.completedAt);
        const dayStr = date.toLocaleDateString('en-US', { weekday: 'short' });
        data[dayStr] = (data[dayStr] || 0) + 1;
      });
    } else if (selectedPeriod === 'month') {
      // Group by week of month
      for (let i = 0; i < 4; i++) {
        data[`Week ${i + 1}`] = 0;
      }
      
      filteredWorkouts.forEach(workout => {
        const date = new Date(workout.completedAt);
        const weekOfMonth = Math.floor(date.getDate() / 7);
        const weekStr = `Week ${weekOfMonth + 1}`;
        data[weekStr] = (data[weekStr] || 0) + 1;
      });
    } else {
      // Group by month
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;
      monthNames.forEach(month => {
        data[month] = 0;
      });
      
      filteredWorkouts.forEach(workout => {
        const date = new Date(workout.completedAt);
        const monthIdx = date.getMonth();
        const monthStr = monthNames[monthIdx];
        if (monthStr) {
          data[monthStr] = (data[monthStr] || 0) + 1;
        }
      });
    }
    
    return data;
  };
  
  const chartData = generateChartData();
  const maxValue = Math.max(...Object.values(chartData), 1);
  
  // Most common muscle groups
  const getMostWorkedMuscleGroups = () => {
    const muscleGroups: Record<string, number> = {};
    
    completedWorkouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        muscleGroups[exercise.muscleGroup] = (muscleGroups[exercise.muscleGroup] || 0) + 1;
      });
    });
    
    return Object.entries(muscleGroups)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  };
  
  const topMuscleGroups = getMostWorkedMuscleGroups();
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Workout Statistics</h1>
        <p className="text-gray-600">Track your fitness progress over time</p>
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Workouts</p>
              <h3 className="text-3xl font-bold text-gray-800">{totalWorkouts}</h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Dumbbell className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Exercises</p>
              <h3 className="text-3xl font-bold text-gray-800">{totalExercises}</h3>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Activity className="h-6 w-6 text-purple-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Training Time</p>
              <h3 className="text-3xl font-bold text-gray-800">{formatTime(totalDuration)}</h3>
            </div>
            <div className="p-3 bg-emerald-100 rounded-full">
              <Clock className="h-6 w-6 text-emerald-500" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Workout Frequency Chart */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <BarChartIcon className="h-5 w-5 text-gray-500 mr-2" />
            <h3 className="text-xl font-bold text-gray-800">Workout Frequency</h3>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedPeriod('week')}
              className={`px-3 py-1 rounded-md text-sm ${
                selectedPeriod === 'week'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setSelectedPeriod('month')}
              className={`px-3 py-1 rounded-md text-sm ${
                selectedPeriod === 'month'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setSelectedPeriod('year')}
              className={`px-3 py-1 rounded-md text-sm ${
                selectedPeriod === 'year'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Year
            </button>
          </div>
        </div>
        
        <div className="h-64">
          {completedWorkouts.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">No workout data available yet.</p>
            </div>
          ) : (
            <div className="flex items-end h-48 space-x-2">
              {Object.entries(chartData).map(([label, value]) => (
                <div key={label} className="flex flex-col items-center flex-1">
                  <div className="w-full bg-gray-100 rounded-t-md relative overflow-hidden transition-all duration-500" style={{ height: `${(value / maxValue) * 100}%` }}>
                    <div className="absolute inset-0 bg-emerald-500 opacity-80"></div>
                  </div>
                  <div className="text-xs text-gray-600 mt-2 truncate w-full text-center">{label}</div>
                  <div className="text-xs font-medium mt-1">{value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Most Worked Muscle Groups */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center mb-6">
          <Dumbbell className="h-5 w-5 text-gray-500 mr-2" />
          <h3 className="text-xl font-bold text-gray-800">Most Worked Muscle Groups</h3>
        </div>
        
        {topMuscleGroups.length === 0 ? (
          <div className="py-4">
            <p className="text-gray-500">No workout data available yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {topMuscleGroups.map(([group, count]) => (
              <div key={group} className="flex items-center">
                <div className="w-32 capitalize font-medium text-gray-700">{group}</div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(count / (topMuscleGroups[0]?.[1] || 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-12 text-right ml-4 text-gray-600">{count}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* No Data Message */}
      {completedWorkouts.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Workout Data Yet</h3>
          <p className="text-gray-600 mb-4">
            Complete workouts to see your statistics and track your progress over time.
          </p>
        </div>
      )}
    </div>
  );
};

export default Stats;