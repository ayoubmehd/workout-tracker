"use client";
import React, { useState, useEffect } from 'react';
import WorkoutCard from '~/app/_components/WorkoutCard';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api } from '~/trpc/react';

const AllWorkouts: React.FC = () => {
  const { data: workouts = [] } = api.workout.getAll.useQuery();
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const navigate = (path: string) => router.push(path);
  const workoutsPerPage = 10;
  
  
  const handleDeleteWorkout = (id: string) => {
    // if (window.confirm('Are you sure you want to delete this workout?')) {
    //   deleteWorkout(id);
    //   const updatedWorkouts = workouts.filter(workout => workout.id !== id);
    //   setWorkouts(updatedWorkouts);
      
    //   // Adjust current page if necessary
    //   const totalPages = Math.ceil(updatedWorkouts.length / workoutsPerPage);
    //   if (currentPage > totalPages && totalPages > 0) {
    //     setCurrentPage(totalPages);
    //   }
    // }
  };
  
  // Calculate pagination
  const totalPages = Math.ceil(workouts.length / workoutsPerPage);
  const startIndex = (currentPage - 1) * workoutsPerPage;
  const endIndex = startIndex + workoutsPerPage;
  const currentWorkouts = workouts.slice(startIndex, endIndex);
  
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <div className="lg:flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">All Workouts</h1>
          <p className="text-gray-600">Manage and organize your workout routines</p>
        </div>
        <div className="mt-4 lg:mt-0">
          <button
            onClick={() => navigate('/create')}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md flex items-center transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Create Workout
          </button>
        </div>
      </div>

      {workouts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 mb-4">You don't have any workouts yet.</p>
          <button
            onClick={() => navigate('/create')}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md inline-flex items-center transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Create Your First Workout
          </button>
        </div>
      ) : (
        <>
          {/* Workouts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentWorkouts.map(workout => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                onStart={() => navigate(`/workout/${workout.id}`)}
                onEdit={() => navigate(`/edit/${workout.id}`)}
                onDelete={() => handleDeleteWorkout(workout.id)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className={`p-2 rounded-md ${
                  currentPage === 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                <ChevronLeft size={20} />
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                // Show first page, last page, current page, and pages around current page
                const showPage = 
                  page === 1 || 
                  page === totalPages || 
                  (page >= currentPage - 1 && page <= currentPage + 1);
                
                if (!showPage) {
                  // Show ellipsis
                  if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <span key={page} className="px-3 py-2 text-gray-500">
                        ...
                      </span>
                    );
                  }
                  return null;
                }

                return (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-3 py-2 rounded-md ${
                      currentPage === page
                        ? 'bg-emerald-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-md ${
                  currentPage === totalPages
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}

          {/* Results Info */}
          <div className="text-center mt-4 text-sm text-gray-600">
            Showing {startIndex + 1}-{Math.min(endIndex, workouts.length)} of {workouts.length} workouts
          </div>
        </>
      )}
    </div>
  );
};

export default AllWorkouts;