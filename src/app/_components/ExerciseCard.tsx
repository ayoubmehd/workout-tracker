import React from 'react';
import type { Exercise, WorkoutExercise } from '~/types';
import { Play, Info, Plus } from 'lucide-react';

interface ExerciseCardProps {
  exercise: Exercise;
  onClick?: () => void;
  onAddToWorkout?: () => void;
  showAddButton?: boolean;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ 
  exercise, 
  onClick, 
  onAddToWorkout,
  showAddButton = false
}) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.01] cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-40 overflow-hidden">
        <img 
          src={exercise.imageUrl} 
          alt={exercise.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-3 flex items-center justify-between w-full">
          <h3 className="text-white font-semibold text-lg">{exercise.name}</h3>
          <div>
            <a 
              href={exercise.tutorialUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="bg-red-500 text-white p-2 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              title="Watch tutorial"
            >
              <Play size={16} />
            </a>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded capitalize">
            {exercise.muscleGroup}
          </span>
          {showAddButton && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onAddToWorkout && onAddToWorkout();
              }}
              className="bg-emerald-500 text-white p-2 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors"
              title="Add to workout"
            >
              <Plus size={16} />
            </button>
          )}
        </div>
        <p className="text-gray-600 text-sm mt-2 line-clamp-2">{exercise.description}</p>
      </div>
    </div>
  );
};

interface WorkoutExerciseCardProps {
  exercise: WorkoutExercise;
  onRemove?: () => void;
  onEdit?: () => void;
  isActive?: boolean;
  onComplete?: () => void;
}

export const WorkoutExerciseCard: React.FC<WorkoutExerciseCardProps> = ({ 
  exercise, 
  onRemove,
  onEdit,
  isActive = false,
  onComplete
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden mb-4 ${isActive ? 'border-2 border-emerald-500' : ''}`}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{exercise.name}</h3>
          <div className="flex space-x-2">
            <a 
              href={exercise.tutorialUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gray-100 text-gray-600 p-1.5 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              title="Watch tutorial"
            >
              <Play size={16} />
            </a>
            <button 
              onClick={onEdit}
              className="bg-blue-100 text-blue-600 p-1.5 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors"
              title="Edit"
            >
              <Info size={16} />
            </button>
          </div>
        </div>
        
        <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
          <div className="bg-gray-50 p-2 rounded">
            <span className="text-gray-500 block">Sets</span>
            <span className="font-medium">{exercise.sets}</span>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <span className="text-gray-500 block">Reps</span>
            <span className="font-medium">{exercise.reps}</span>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <span className="text-gray-500 block">Rest</span>
            <span className="font-medium">{exercise.restTime}s</span>
          </div>
          {exercise.weight && (
            <div className="bg-gray-50 p-2 rounded">
              <span className="text-gray-500 block">Weight</span>
              <span className="font-medium">{exercise.weight} kg</span>
            </div>
          )}
          {exercise.duration && (
            <div className="bg-gray-50 p-2 rounded">
              <span className="text-gray-500 block">Duration</span>
              <span className="font-medium">{exercise.duration}s</span>
            </div>
          )}
        </div>
        
        {(onRemove || onComplete) && (
          <div className="mt-3 flex justify-end space-x-2">
            {onRemove && (
              <button 
                onClick={onRemove}
                className="bg-red-100 text-red-600 px-3 py-1.5 rounded text-sm hover:bg-red-200 transition-colors"
              >
                Remove
              </button>
            )}
            {onComplete && isActive && (
              <button 
                onClick={onComplete}
                className="bg-emerald-500 text-white px-3 py-1.5 rounded text-sm hover:bg-emerald-600 transition-colors"
              >
                Complete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseCard;