import React from 'react';
import WorkoutForm from '~/app/_components/WorkoutForm';
import { api } from '~/trpc/server';

const Create = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;


  const workout = await api.workout.getById({
    id, 
  });
  const exercises = await api.workout.getExercisesByWorkoutId({
    id,
  })
  if (!workout) return;
  if (!exercises) return;

  return (
    <WorkoutForm
      workout={workout} 
      workoutExercises={exercises}
    />
  )
};

export default Create;