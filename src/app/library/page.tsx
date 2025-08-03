"use client";

import React, { useState } from 'react';
import ExerciseCard from '../_components/ExerciseCard';
import type { MuscleGroup, Exercise } from '~/types';
import { Search, Filter } from 'lucide-react';
import { api } from '~/trpc/react';

const Library: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<MuscleGroup | 'all'>('all');

  const { data: exercises = [] } = api.exercise.getAll.useQuery();
  
  // Get all unique muscle groups
  const muscleGroups = Array.from(new Set(exercises.map(ex => ex.muscleGroup)));
  
  // Filter exercises based on search term and selected muscle group
  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMuscleGroup = selectedMuscleGroup === 'all' || exercise.muscleGroup === selectedMuscleGroup;
    
    return matchesSearch && matchesMuscleGroup;
  });
  
  // Group exercises by muscle group for the "all" view
  const groupedExercises = {} as Record<string, Exercise[]>;
  
  if (selectedMuscleGroup === 'all') {
    muscleGroups.forEach(group => {
      groupedExercises[group] = exercises.filter(
        ex => ex.muscleGroup === group && 
             (ex.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
              ex.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });
  }
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Exercise Library</h1>
        <p className="text-gray-600">Browse exercises and watch tutorials</p>
      </div>
      
      {/* Search and Filter */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={selectedMuscleGroup}
              onChange={(e) => setSelectedMuscleGroup(e.target.value as MuscleGroup | 'all')}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none bg-white"
            >
              <option value="all">All Muscle Groups</option>
              {muscleGroups.map(group => (
                <option key={group} value={group} className="capitalize">{group}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Exercise Grid */}
      {selectedMuscleGroup === 'all' ? (
        // Grouped view
        <>
          {muscleGroups.map(group => {
            // Skip empty groups
            if (groupedExercises[group]?.length === 0) return null;
            
            return (
              <div key={group} className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 capitalize">{group}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedExercises[group]?.map(exercise => (
                    <ExerciseCard 
                      key={exercise.id} 
                      exercise={exercise}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </>
      ) : (
        // Filtered view
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map(exercise => (
            <ExerciseCard 
              key={exercise.id} 
              exercise={exercise}
            />
          ))}
        </div>
      )}
      
      {/* No results message */}
      {(selectedMuscleGroup === 'all' && Object.values(groupedExercises).every(group => group.length === 0)) ||
        (selectedMuscleGroup !== 'all' && filteredExercises.length === 0) ? (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-2">No exercises found matching your search criteria.</p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setSelectedMuscleGroup('all');
            }}
            className="text-emerald-500 hover:text-emerald-600 font-medium"
          >
            Clear filters
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default Library;