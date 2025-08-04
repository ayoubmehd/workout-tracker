// Types for the workout tracker app
import { exercises, workouts } from "~/server/db/schema";

export type Exercise = typeof exercises.$inferSelect;

export interface WorkoutExercise extends Exercise {
  sets: number;
  reps: number;
  weight?: number;
  duration?: number; // in seconds, for timed exercises
  restTime: number; // in seconds
}

export type Workout = typeof workouts.$inferSelect & {
  exercises?: Exercise[];
};

export interface CreateWorkout extends Omit<Workout, 'id'> {
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