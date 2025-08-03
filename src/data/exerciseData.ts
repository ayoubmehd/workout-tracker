import type { Exercise, MuscleGroup } from '../types';

export const exercises: Exercise[] = [
  {
    id: '1',
    name: 'Bench Press',
    muscleGroup: 'chest',
    description: 'A compound exercise that works the chest, shoulders, and triceps.',
    tutorialUrl: 'https://www.youtube.com/watch?v=rT7DgCr-3pg',
    imageUrl: 'https://images.pexels.com/photos/4162451/pexels-photo-4162451.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: '2',
    name: 'Squats',
    muscleGroup: 'legs',
    description: 'A compound exercise that targets the quadriceps, hamstrings, and glutes.',
    tutorialUrl: 'https://www.youtube.com/watch?v=YaXPRqUwItQ',
    imageUrl: 'https://images.pexels.com/photos/4164761/pexels-photo-4164761.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: '3',
    name: 'Deadlift',
    muscleGroup: 'back',
    description: 'A compound exercise that works the back, glutes, and hamstrings.',
    tutorialUrl: 'https://www.youtube.com/watch?v=r4MzxtBKyNE',
    imageUrl: 'https://images.pexels.com/photos/1552249/pexels-photo-1552249.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: '4',
    name: 'Pull-ups',
    muscleGroup: 'back',
    description: 'A compound exercise that targets the back and biceps.',
    tutorialUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g',
    imageUrl: 'https://images.pexels.com/photos/6551133/pexels-photo-6551133.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: '5',
    name: 'Shoulder Press',
    muscleGroup: 'shoulders',
    description: 'An exercise that targets the deltoids and triceps.',
    tutorialUrl: 'https://www.youtube.com/watch?v=qEwKCR5JCog',
    imageUrl: 'https://images.pexels.com/photos/5209106/pexels-photo-5209106.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: '6',
    name: 'Bicep Curls',
    muscleGroup: 'arms',
    description: 'An isolation exercise that targets the biceps.',
    tutorialUrl: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo',
    imageUrl: 'https://images.pexels.com/photos/4164775/pexels-photo-4164775.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: '7',
    name: 'Plank',
    muscleGroup: 'core',
    description: 'A static exercise that strengthens the core, shoulders, and glutes.',
    tutorialUrl: 'https://www.youtube.com/watch?v=pSHjTRCQxIw',
    imageUrl: 'https://images.pexels.com/photos/6740056/pexels-photo-6740056.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: '8',
    name: 'Running',
    muscleGroup: 'cardio',
    description: 'Cardiovascular exercise that improves endurance and burns calories.',
    tutorialUrl: 'https://www.youtube.com/watch?v=_kGESn8ArrU',
    imageUrl: 'https://images.pexels.com/photos/6456301/pexels-photo-6456301.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: '9',
    name: 'Burpees',
    muscleGroup: 'full body',
    description: 'A full-body exercise that combines a squat, plank, push-up, and jump.',
    tutorialUrl: 'https://www.youtube.com/watch?v=TU8QYVW0gDU',
    imageUrl: 'https://images.pexels.com/photos/4327024/pexels-photo-4327024.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: '10',
    name: 'Lunges',
    muscleGroup: 'legs',
    description: 'A unilateral exercise that targets the quadriceps, hamstrings, and glutes.',
    tutorialUrl: 'https://www.youtube.com/watch?v=QOVaHwm-Q6U',
    imageUrl: 'https://images.pexels.com/photos/4164766/pexels-photo-4164766.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: '11',
    name: 'Tricep Dips',
    muscleGroup: 'arms',
    description: 'An exercise that targets the triceps and shoulders.',
    tutorialUrl: 'https://www.youtube.com/watch?v=6kALZikXxLc',
    imageUrl: 'https://images.pexels.com/photos/4162484/pexels-photo-4162484.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: '12',
    name: 'Russian Twists',
    muscleGroup: 'core',
    description: 'A rotational exercise that targets the obliques and core.',
    tutorialUrl: 'https://www.youtube.com/watch?v=wkD8rjkodUI',
    imageUrl: 'https://images.pexels.com/photos/4498155/pexels-photo-4498155.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  }
];

export const getExercisesByMuscleGroup = (muscleGroup: MuscleGroup): Exercise[] => {
  return exercises.filter(exercise => exercise.muscleGroup === muscleGroup);
};

export const getExerciseById = (id: string): Exercise | undefined => {
  return exercises.find(exercise => exercise.id === id);
};