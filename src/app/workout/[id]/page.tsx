"use client";

import React, { useState, useEffect } from 'react';
import type { Workout, WorkoutExercise, CompletedWorkout, CompletedExercise, CompletedSet, WorkoutStatus } from '~/types';
import { WorkoutExerciseCard } from '~/app/_components/ExerciseCard';
import Timer from '~/app/_components/Timer';
import { Play, Pause, X, Check, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useParams, useRouter } from "next/navigation";

const ActiveWorkout: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [completedExercises, setCompletedExercises] = useState<CompletedExercise[]>([]);
  const [workoutStatus, setWorkoutStatus] = useState<WorkoutStatus>('not-started');

  const router = useRouter()

  
  const navigate = (path: string) => router.push(path);
  
  // Initialize workout
  
  // Start timer for tracking total workout duration
  useEffect(() => {
    let intervalId: number;
    
    if (workoutStatus === 'in-progress' && isTimerRunning) {
      intervalId = window.setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [workoutStatus, isTimerRunning]);
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const handleCompleteSet = () => {
    if (!workout) return;
    
    const currentExercise = workout.exercises[currentExerciseIndex];

    if (!currentExercise) {
      return;
    }
    
    // Already on the last set of last exercise
    if (currentExerciseIndex === workout.exercises.length - 1 && currentSetIndex === currentExercise.sets - 1) {
      handleCompleteWorkout();
      return;
    }
    
    // Last set of current exercise
    if (currentSetIndex === currentExercise.sets - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setCurrentSetIndex(0);
    } else {
      // Start rest timer
      setIsResting(true);
      setCurrentSetIndex(currentSetIndex + 1);
    }
  };
  
  const handleRestComplete = () => {
    setIsResting(false);
  };
  
  const handleCompleteWorkout = () => {
    if (!workout) return;
    
    const completedWorkout: CompletedWorkout = {
      ...workout,
      completedAt: new Date(),
      duration: elapsedTime,
      exercises: completedExercises
    };
    
    // saveCompletedWorkout(completedWorkout);
    setWorkoutStatus('completed');
  };
  
  const handleCancelWorkout = () => {
    if (window.confirm('Are you sure you want to cancel this workout?')) {
      setWorkoutStatus('canceled');
    }
  };
  
  const updateSetData = (exerciseIndex: number, setIndex: number, data: Partial<CompletedSet>) => {
    const updatedExercises = [...completedExercises];
    if (!updatedExercises[exerciseIndex]) return;

    if (!updatedExercises[exerciseIndex].completedSets[setIndex]) return;

    updatedExercises[exerciseIndex].completedSets[setIndex] = {
      ...updatedExercises[exerciseIndex].completedSets[setIndex],
      ...data
    };
    setCompletedExercises(updatedExercises);
  };
  
  // Render loading state
  if (!workout) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
      </div>
    );
  }
  
  // Render completed or canceled state
  if (workoutStatus === 'completed' || workoutStatus === 'canceled') {
    return (
      <div className="container mx-auto px-4 py-6 max-w-3xl min-h-screen flex flex-col justify-center items-center">
        <div className="bg-white rounded-lg shadow-md p-8 text-center w-full max-w-md">
          <div className={`mx-auto h-16 w-16 flex items-center justify-center rounded-full ${
            workoutStatus === 'completed' ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {workoutStatus === 'completed' ? (
              <Check className={`h-8 w-8 text-green-500`} />
            ) : (
              <X className={`h-8 w-8 text-red-500`} />
            )}
          </div>
          
          <h2 className="text-2xl font-bold mt-4 text-gray-800">
            {workoutStatus === 'completed' ? 'Workout Completed!' : 'Workout Canceled'}
          </h2>
          
          {workoutStatus === 'completed' && (
            <>
              <p className="text-gray-600 mt-2">
                Great job completing your workout!
              </p>
              <div className="mt-4 flex justify-center">
                <div className="text-center px-4">
                  <p className="text-xs text-gray-500">DURATION</p>
                  <p className="text-lg font-semibold">{formatTime(elapsedTime)}</p>
                </div>
                <div className="text-center px-4 border-l border-gray-200">
                  <p className="text-xs text-gray-500">EXERCISES</p>
                  <p className="text-lg font-semibold">{workout.exercises.length}</p>
                </div>
              </div>
            </>
          )}
          
          <div className="mt-6">
            <button
              onClick={() => navigate('/')}
              className="bg-emerald-500 text-white py-2 px-4 rounded-md hover:bg-emerald-600 transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  const currentExercise = workout.exercises[currentExerciseIndex];

  if (!currentExercise) return null;

  if (!completedExercises[currentExerciseIndex]) return null;

  if (!completedExercises[currentExerciseIndex].completedSets[currentSetIndex]) return null;

  const prevIndex = currentExerciseIndex - 1;
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      {/* Workout Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{workout.name}</h1>
          <div className="flex items-center text-gray-600">
            <Clock size={16} className="mr-1" />
            <span>{formatTime(elapsedTime)}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className={`p-2 rounded-full ${
              isTimerRunning ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-emerald-500 hover:bg-emerald-600'
            } text-white`}
            title={isTimerRunning ? 'Pause Workout' : 'Resume Workout'}
          >
            {isTimerRunning ? <Pause size={20} /> : <Play size={20} />}
          </button>
          
          <button
            onClick={handleCancelWorkout}
            className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
            title="Cancel Workout"
          >
            <X size={20} />
          </button>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 transition-all duration-300 ease-out"
            style={{ 
              width: `${(((currentExerciseIndex * currentExercise.sets) + currentSetIndex) / 
                (workout.exercises.reduce((acc, ex) => acc + ex.sets, 0))) * 100}%` 
            }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-600">
          <div>{currentExerciseIndex + 1}/{workout.exercises.length} Exercise</div>
          <div>Set {currentSetIndex + 1}/{currentExercise.sets}</div>
        </div>
      </div>
      
      {/* Current Exercise */}
      {isResting ? (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-center mb-2">Rest Time</h2>
          <p className="text-center text-gray-600 mb-4">
            Next up: Set {currentSetIndex + 1} of {currentExercise.name}
          </p>
          <div className="flex justify-center">
            <Timer 
              duration={currentExercise.restTime}
              onComplete={handleRestComplete}
              autoStart={true}
            />
          </div>
          <div className="text-center mt-4">
            <button
              onClick={handleRestComplete}
              className="text-emerald-500 hover:text-emerald-600 font-medium"
            >
              Skip Rest
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold">{currentExercise.name}</h2>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded capitalize">
                {currentExercise.muscleGroup}
              </span>
            </div>
            <div>
              <a 
                href={currentExercise.tutorialUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-red-500 text-white p-2 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                title="Watch tutorial"
              >
                <Play size={16} />
              </a>
            </div>
          </div>
          
          <div className="flex justify-center items-center space-x-6 mb-6">
            <button
              onClick={() => {
                if (currentSetIndex > 0) {
                  setCurrentSetIndex(currentSetIndex - 1);
                } else if (currentExerciseIndex > 0) {
                  const prevExercise = workout.exercises[prevIndex];
                  if (prevExercise) {
                    setCurrentExerciseIndex(prevIndex);
                    setCurrentSetIndex(prevExercise.sets - 1);
                  }
                }
              }}
              disabled={currentExerciseIndex === 0 && currentSetIndex === 0}
              className={`p-2 rounded-full ${
                currentExerciseIndex === 0 && currentSetIndex === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="text-center">
              <p className="text-3xl font-bold mb-1">Set {currentSetIndex + 1}</p>
              <p className="text-gray-600">of {currentExercise.sets}</p>
            </div>
            
            <button
              onClick={() => {
                if (currentSetIndex < currentExercise.sets - 1) {
                  setCurrentSetIndex(currentSetIndex + 1);
                } else if (currentExerciseIndex < workout.exercises.length - 1) {
                  setCurrentExerciseIndex(currentExerciseIndex + 1);
                  setCurrentSetIndex(0);
                }
              }}
              disabled={currentExerciseIndex === workout.exercises.length - 1 && currentSetIndex === currentExercise.sets - 1}
              className={`p-2 rounded-full ${
                currentExerciseIndex === workout.exercises.length - 1 && currentSetIndex === currentExercise.sets - 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            {currentExercise.weight !== undefined && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={completedExercises[currentExerciseIndex].completedSets[currentSetIndex].weight || 0}
                  onChange={(e) => {
                    updateSetData(
                      currentExerciseIndex,
                      currentSetIndex,
                      { weight: parseFloat(e.target.value) || 0 }
                    );
                  }}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            )}
            
            {currentExercise.duration !== undefined ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (seconds)</label>
                <input
                  type="number"
                  min="0"
                  value={completedExercises[currentExerciseIndex].completedSets[currentSetIndex].duration || 0}
                  onChange={(e) => {
                    updateSetData(
                      currentExerciseIndex,
                      currentSetIndex,
                      { duration: parseInt(e.target.value) || 0 }
                    );
                  }}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reps</label>
                <input
                  type="number"
                  min="0"
                  value={completedExercises[currentExerciseIndex].completedSets[currentSetIndex].reps}
                  onChange={(e) => {
                    updateSetData(
                      currentExerciseIndex,
                      currentSetIndex,
                      { reps: parseInt(e.target.value) || 0 }
                    );
                  }}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            )}
          </div>
          
          <button
            onClick={handleCompleteSet}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-md font-medium transition-colors"
          >
            {currentExerciseIndex === workout.exercises.length - 1 && currentSetIndex === currentExercise.sets - 1
              ? 'Complete Workout'
              : currentSetIndex === currentExercise.sets - 1
                ? 'Next Exercise'
                : 'Complete Set'
            }
          </button>
        </div>
      )}
      
      {/* Upcoming Exercises */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Up Next</h3>
        
        {workout.exercises.slice(currentExerciseIndex + (currentSetIndex === currentExercise.sets - 1 ? 1 : 0), currentExerciseIndex + 3).map((exercise, index) => (
          <WorkoutExerciseCard
            key={`upcoming-${exercise.id}-${index}`}
            exercise={exercise}
            isActive={index === 0 && currentSetIndex === currentExercise.sets - 1}
          />
        ))}
        
        {currentExerciseIndex >= workout.exercises.length - 1 && currentSetIndex === currentExercise.sets - 1 && (
          <div className="text-center py-4">
            <p className="text-gray-600">That's the last exercise! Good job!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveWorkout;