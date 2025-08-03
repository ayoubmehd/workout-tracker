// Types for the workout tracker app

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  description: string;
  tutorialUrl: string;
  imageUrl: string;
}

export interface WorkoutExercise extends Exercise {
  sets: number;
  reps: number;
  weight?: number;
  duration?: number; // in seconds, for timed exercises
  restTime: number; // in seconds
}

export interface Workout {
  id: string;
  name: string;
  description: string;
  exercises: WorkoutExercise[];
  createdAt: Date;
  lastPerformed?: Date;
}

export interface CompletedWorkout extends Workout {
  completedAt: Date;
  duration: number; // in seconds
  exercises: CompletedExercise[];
}

export interface CompletedExercise extends WorkoutExercise {
  completedSets: CompletedSet[];
}

export interface CompletedSet {
  reps: number;
  weight?: number;
  duration?: number;
}

export type MuscleGroup = 
  | 'chest'
  | 'back'
  | 'legs'
  | 'shoulders'
  | 'arms'
  | 'core'
  | 'cardio'
  | 'full body';

export type WorkoutStatus = 'not-started' | 'in-progress' | 'completed' | 'canceled';