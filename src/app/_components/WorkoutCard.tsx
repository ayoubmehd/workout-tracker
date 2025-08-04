"use client";

import React from 'react';
import type { Workout, CompletedWorkout } from '~/types';
import { Clock, Calendar, Play, Edit, Trash } from 'lucide-react';

interface WorkoutCardProps {
  workout: Workout;
  onStart?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

// Helper to get relative time
const getRelativeTime = (date: Date) => {
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  return `${Math.floor(diffInDays / 30)} months ago`;
};

const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, onStart, onEdit, onDelete }) => {
  // Calculate total exercises and unique muscle groups
  const totalExercises = workout.exercises?.length;
  const muscleGroups = [...new Set(workout.exercises?.map(ex => ex.muscleGroup))];
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.01]">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{workout.name}</h2>
            <p className="text-gray-600 text-sm mt-1">{workout.description}</p>
          </div>
          
          <div className="flex space-x-1">
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                title="Edit workout"
              >
                <Edit size={18} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                title="Delete workout"
              >
                <Trash size={18} />
              </button>
            )}
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {muscleGroups.map(group => (
            <span 
              key={group} 
              className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded capitalize"
            >
              {group}
            </span>
          ))}
        </div>
        
        <div className="mt-4 flex items-center text-sm text-gray-600 space-x-4">
          <div className="flex items-center">
            <Calendar size={16} className="mr-1" />
            <span>Created {getRelativeTime(workout.createdAt)}</span>
          </div>
          
          {workout.updatedAt && (
            <div className="flex items-center">
              <Clock size={16} className="mr-1" />
              <span>Last done {getRelativeTime(workout.updatedAt)}</span>
            </div>
          )}
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm font-medium">{totalExercises} exercise{totalExercises !== 1 ? 's' : ''}</div>
          
          {onStart && (
            <button
              onClick={onStart}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md flex items-center transition-colors"
            >
              <Play size={16} className="mr-1" />
              Start Workout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface CompletedWorkoutCardProps {
  workout: CompletedWorkout;
}

export const CompletedWorkoutCard: React.FC<CompletedWorkoutCardProps> = ({ workout }) => {
  // Format workout duration
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{workout.name}</h3>
            <p className="text-gray-500 text-sm">{getRelativeTime(workout.completedAt)}</p>
          </div>
          <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
            Completed
          </div>
        </div>
        
        <div className="mt-3 flex items-center text-sm text-gray-600 space-x-4">
          <div className="flex items-center">
            <Clock size={16} className="mr-1" />
            <span>Duration: {formatDuration(workout.duration)}</span>
          </div>
        </div>
        
        <div className="mt-3">
          <div className="text-sm font-medium">{workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}</div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutCard;