import React, { useState, useEffect } from 'react';
import type { Exercise, WorkoutExercise } from '~/types';

interface ExerciseFormProps {
  exercise: Exercise;
  existingWorkoutExercise?: WorkoutExercise;
  onSave: (workoutExercise: WorkoutExercise) => void;
  onCancel: () => void;
}

const ExerciseForm: React.FC<ExerciseFormProps> = ({ 
  exercise, 
  existingWorkoutExercise, 
  onSave, 
  onCancel 
}) => {
  const [sets, setSets] = useState(existingWorkoutExercise?.sets || 3);
  const [reps, setReps] = useState(existingWorkoutExercise?.reps || 10);
  const [weight, setWeight] = useState(existingWorkoutExercise?.weight || 0);
  const [duration, setDuration] = useState(existingWorkoutExercise?.duration || 0);
  const [restTime, setRestTime] = useState(existingWorkoutExercise?.restTime || 60);
  
  const isCardio = exercise.muscleGroup === 'cardio';
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const workoutExercise: WorkoutExercise = {
      ...exercise,
      sets,
      reps,
      restTime,
      ...(isCardio 
        ? { duration: duration > 0 ? duration : undefined } 
        : { weight: weight > 0 ? weight : undefined }
      )
    };
    
    onSave(workoutExercise);
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{exercise.name}</h2>
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded capitalize">
          {exercise.muscleGroup}
        </span>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sets</label>
            <input
              type="number"
              min="1"
              value={sets}
              onChange={(e) => setSets(parseInt(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isCardio ? 'Duration (seconds)' : 'Reps'}
            </label>
            {isCardio ? (
              <input
                type="number"
                min="1"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            ) : (
              <input
                type="number"
                min="1"
                value={reps}
                onChange={(e) => setReps(parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            )}
          </div>
          
          {!isCardio && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rest Time (seconds)</label>
            <input
              type="number"
              min="0"
              step="5"
              value={restTime}
              onChange={(e) => setRestTime(parseInt(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
          >
            Save Exercise
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExerciseForm;