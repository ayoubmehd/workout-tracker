"use client";

import React, { useState } from 'react';
import type { Exercise, Workout, WorkoutExercise } from '~/types';
import { exercises } from '~/data/exerciseData';
import ExerciseCard, { WorkoutExerciseCard } from '~/app/_components/ExerciseCard';
import ExerciseForm from '~/app/_components/ExerciseForm';
import { Search, X, Save, ArrowLeft } from 'lucide-react';
import { useRouter, useParams } from "next/navigation";

const Create: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<WorkoutExercise[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [editingExerciseIndex, setEditingExerciseIndex] = useState<number | null>(null);

  const navigate = (path: string) => router.push(path);
  
  // Filter exercises based on search term
  const filteredExercises = exercises.filter(exercise => 
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exercise.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exercise.muscleGroup.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAddExercise = (exercise: Exercise) => {
    setCurrentExercise(exercise);
    setShowExerciseForm(true);
  };

  const updateWorkout = (workout: Workout) => {};

  const saveWorkout = (workout: Workout) => {};
  
  const handleSaveExercise = (workoutExercise: WorkoutExercise) => {
    if (editingExerciseIndex !== null) {
      // Update existing exercise
      const updatedExercises = [...selectedExercises];
      updatedExercises[editingExerciseIndex] = workoutExercise;
      setSelectedExercises(updatedExercises);
      setEditingExerciseIndex(null);
    } else {
      // Add new exercise
      setSelectedExercises([...selectedExercises, workoutExercise]);
    }
    
    setShowExerciseForm(false);
    setCurrentExercise(null);
  };
  
  const handleRemoveExercise = (index: number) => {
    const updatedExercises = [...selectedExercises];
    updatedExercises.splice(index, 1);
    setSelectedExercises(updatedExercises);
  };
  
  const handleEditExercise = (index: number) => {
    setCurrentExercise(selectedExercises[index] || null);
    setEditingExerciseIndex(index);
    setShowExerciseForm(true);
  };
  
  const handleSaveWorkout = () => {
    if (!name.trim()) {
      alert('Please enter a workout name');
      return;
    }
    
    if (selectedExercises.length === 0) {
      alert('Please add at least one exercise to your workout');
      return;
    }
    
    const workout: Workout = {
      id,
      name,
      description,
      exercises: selectedExercises,
      createdAt: id ? new Date() : new Date(),
    };
    
    if (id) {
      updateWorkout(workout);
    } else {
      saveWorkout(workout);
    }
    
    navigate('/');
  };
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <button
        onClick={() => router.back()}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
      >
        <ArrowLeft size={20} className="mr-1" />
        Back
      </button>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{id ? 'Edit Workout' : 'Create Workout'}</h1>
        <p className="text-gray-600">{id ? 'Modify your existing workout plan' : 'Design your custom workout routine'}</p>
      </div>
      
      {/* Workout Details */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Workout Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Upper Body Strength"
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description (optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of the workout"
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 h-20"
          />
        </div>
      </div>
      
      {/* Selected Exercises */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Exercises</h2>
        
        {selectedExercises.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600 mb-4">No exercises added yet. Search and add exercises below.</p>
          </div>
        ) : (
          <div className="mb-6">
            {selectedExercises.map((exercise, index) => (
              <WorkoutExerciseCard
                key={`${exercise.id}-${index}`}
                exercise={exercise}
                onRemove={() => handleRemoveExercise(index)}
                onEdit={() => handleEditExercise(index)}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Exercise Library */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Exercises</h2>
        
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search exercises by name, muscle group, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map(exercise => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              showAddButton={true}
              onAddToWorkout={() => handleAddExercise(exercise)}
            />
          ))}
        </div>
        
        {filteredExercises.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No exercises found matching your search criteria.</p>
          </div>
        )}
      </div>
      
      {/* Form Modal */}
      {showExerciseForm && currentExercise && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-md w-full">
            <ExerciseForm
              exercise={currentExercise}
              existingWorkoutExercise={editingExerciseIndex !== null ? selectedExercises[editingExerciseIndex] : undefined}
              onSave={handleSaveExercise}
              onCancel={() => {
                setShowExerciseForm(false);
                setCurrentExercise(null);
                setEditingExerciseIndex(null);
              }}
            />
          </div>
        </div>
      )}
      
      {/* Save Button */}
      <div className="flex justify-end mb-8">
        <button
          onClick={handleSaveWorkout}
          disabled={!name.trim() || selectedExercises.length === 0}
          className={`flex items-center px-6 py-2 rounded-md text-white ${
            !name.trim() || selectedExercises.length === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-emerald-500 hover:bg-emerald-600'
          }`}
        >
          <Save size={20} className="mr-2" />
          Save Workout
        </button>
      </div>
    </div>
  );
};

export default Create;