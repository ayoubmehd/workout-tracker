"use client";

import React, { useState } from 'react';
import WorkoutCard, { CompletedWorkoutCard } from '~/app/_components/WorkoutCard';
import type { Workout, CompletedWorkout } from '~/types';
import { Plus, Calendar, Activity, ArrowRight } from 'lucide-react';
import { useRouter } from "next/navigation"

const Dashboard: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [completedWorkouts, setCompletedWorkouts] = useState<CompletedWorkout[]>([]);
  const router = useRouter();

  const navigate = (path: string) => router.push(path);
  const deleteWorkout = (id: string) => {}
  
  const handleDeleteWorkout = (id: string) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      deleteWorkout(id);
      setWorkouts(workouts.filter(workout => workout.id !== id));
    }
  };
  
  // Calculate stats
  const totalWorkoutsCompleted = completedWorkouts.length;
  const last7DaysWorkouts = completedWorkouts.filter(workout => {
    const workoutDate = new Date(workout.completedAt);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - workoutDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }).length;
  
  const calculateStreakDays = () => {
    if (completedWorkouts.length === 0) return 0;
    
    // Sort by date (newest first)
    const sortedWorkouts = [...completedWorkouts].sort((a, b) => 
      new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    );
    
    // Check if worked out today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const latestWorkout = new Date(sortedWorkouts[0]?.completedAt || 0);
    latestWorkout.setHours(0, 0, 0, 0);
    
    // If no workout today, no streak
    if (latestWorkout.getTime() < today.getTime()) return 0;
    
    // Count consecutive days
    let streak = 1;
    let currentDate = today;
    
    for (let i = 1; i < sortedWorkouts.length; i++) {
      const prevDay = new Date(currentDate);
      prevDay.setDate(prevDay.getDate() - 1);
      
      const workoutDate = new Date(sortedWorkouts[i]?.completedAt || 0);
      workoutDate.setHours(0, 0, 0, 0);
      
      if (workoutDate.getTime() === prevDay.getTime()) {
        streak++;
        currentDate = prevDay;
      } else {
        break;
      }
    }
    
    return streak;
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <div className="lg:flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Track your progress and start new workouts</p>
        </div>
        <div className="mt-4 lg:mt-0">
          <button
            onClick={() => navigate('/create')}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md flex items-center transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Create Workout
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Workouts</p>
              <h3 className="text-3xl font-bold text-gray-800">{totalWorkoutsCompleted}</h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Activity className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Current Streak</p>
              <h3 className="text-3xl font-bold text-gray-800">{calculateStreakDays()} days</h3>
            </div>
            <div className="p-3 bg-emerald-100 rounded-full">
              <Calendar className="h-6 w-6 text-emerald-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Last 7 Days</p>
              <h3 className="text-3xl font-bold text-gray-800">{last7DaysWorkouts}</h3>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Calendar className="h-6 w-6 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* My Workouts Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">My Workouts</h2>
          {workouts.length > 3 && (
            <button
              onClick={() => navigate('/workouts')}
              className="text-emerald-500 hover:text-emerald-600 flex items-center text-sm font-medium"
            >
              View All <ArrowRight size={16} className="ml-1" />
            </button>
          )}
        </div>
        
        {workouts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 mb-4">You don't have any workouts yet.</p>
            <button
              onClick={() => navigate('/create')}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md inline-flex items-center transition-colors"
            >
              <Plus size={20} className="mr-2" />
              Create Your First Workout
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workouts.slice(0, 3).map(workout => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                onStart={() => navigate(`/workout/${workout.id}`)}
                onEdit={() => navigate(`/edit/${workout.id}`)}
                onDelete={() => handleDeleteWorkout(workout.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity Section */}
      {completedWorkouts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Recent Activity</h2>
            {completedWorkouts.length > 5 && (
              <button
                onClick={() => navigate('/history')}
                className="text-emerald-500 hover:text-emerald-600 flex items-center text-sm font-medium"
              >
                View All <ArrowRight size={16} className="ml-1" />
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedWorkouts.map(workout => (
              <CompletedWorkoutCard key={workout.id + workout.completedAt.toString()} workout={workout} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;