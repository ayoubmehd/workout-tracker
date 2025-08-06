"use client";

import React, { useMemo, useState } from "react";
import type {
  CreateWorkout,
  Exercise,
  Workout,
  WorkoutExercise,
} from "~/types";
import { exercises } from "~/data/exerciseData";
import ExerciseCard, {
  WorkoutExerciseCard,
} from "~/app/_components/ExerciseCard";
import ExerciseForm from "~/app/_components/ExerciseForm";
import { Search, X, Save, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";


const WorkoutForm = ({ workout, workoutExercises }: { workout?: Workout, workoutExercises?: WorkoutExercise[] }) => {
  const router = useRouter();
  const id = workout?.id;
  const [name, setName] = useState(workout?.name || '');
  const [description, setDescription] = useState(workout?.description || '');
  const [selectedExercises, setSelectedExercises] = useState<WorkoutExercise[]>(
    workoutExercises || [],
  );

  const existingExercises = useMemo(() => new Set(workoutExercises?.map(item => item.id)), [workoutExercises]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [editingExerciseIndex, setEditingExerciseIndex] = useState<
    number | null
  >(null);
  const { mutate: saveWorkout } = api.workout.create.useMutation();
  const { mutate: updateWorkout } = api.workout.update.useMutation();

  const navigate = (path: string) => router.push(path);

  // Filter exercises based on search term
  const filteredExercises = exercises.filter(
    (exercise) =>
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.muscleGroup.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAddExercise = (exercise: Exercise) => {
    setCurrentExercise(exercise);
    setShowExerciseForm(true);
  };

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
    if (!name?.trim()) {
      alert("Please enter a workout name");
      return;
    }

    if (selectedExercises.length === 0) {
      alert("Please add at least one exercise to your workout");
      return;
    }

    if (id) {
      const newExercises = selectedExercises.filter(item => !existingExercises.has(item.id))
        .map((item) => ({
          ...item,
          exerciseId: item.id,
          sets: item.sets || undefined,
          reps: item.reps || undefined,
        }));
      

      const isInSelectedExercises = (id: string) => !!selectedExercises.find(x => x.id === id)

      let exercisesToDelete: string[] = [];
      if (workoutExercises?.length) {
        exercisesToDelete = workoutExercises.filter(item => !isInSelectedExercises(item.id)).map(item => item.id);
      }
      console.log("exercisesToDelete: ", exercisesToDelete)
      updateWorkout({
        id,
        name,
        description,
        exercises: newExercises,
        exercisesToDelete,
      });
    } else {
      saveWorkout({
        name,
        description,
        exercises: selectedExercises.map((item) => ({
          ...item,
          exerciseId: item.id,
          sets: item.sets || undefined,
          reps: item.reps || undefined,
        })),
      });
    }

    // navigate("/");
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-6">
      <button
        onClick={() => router.back()}
        className="mb-4 flex items-center text-gray-600 hover:text-gray-800"
      >
        <ArrowLeft size={20} className="mr-1" />
        Back
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          {id ? "Edit Workout" : "Create Workout"}
        </h1>
        <p className="text-gray-600">
          {id
            ? "Modify your existing workout plan"
            : "Design your custom workout routine"}
        </p>
      </div>

      {/* Workout Details */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
        <div className="mb-4">
          <label
            htmlFor="name"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Workout Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Upper Body Strength"
            className="w-full rounded border border-gray-300 p-2 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="description"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Description (optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of the workout"
            className="h-20 w-full rounded border border-gray-300 p-2 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Selected Exercises */}
      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-bold text-gray-800">Exercises</h2>

        {selectedExercises.length === 0 ? (
          <div className="rounded-lg bg-white p-6 text-center shadow-md">
            <p className="mb-4 text-gray-600">
              No exercises added yet. Search and add exercises below.
            </p>
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
        <h2 className="mb-4 text-2xl font-bold text-gray-800">Add Exercises</h2>

        <div className="relative mb-6">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search exercises by name, muscle group, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredExercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              showAddButton={true}
              onAddToWorkout={() => handleAddExercise(exercise)}
            />
          ))}
        </div>

        {filteredExercises.length === 0 && (
          <div className="py-10 text-center">
            <p className="text-gray-500">
              No exercises found matching your search criteria.
            </p>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showExerciseForm && currentExercise && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
          <div className="w-full max-w-md">
            <ExerciseForm
              exercise={currentExercise}
              existingWorkoutExercise={
                editingExerciseIndex !== null
                  ? selectedExercises[editingExerciseIndex]
                  : undefined
              }
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
      <div className="mb-8 flex justify-end">
        <button
          onClick={handleSaveWorkout}
          disabled={!name?.trim() || selectedExercises.length === 0}
          className={`flex items-center rounded-md px-6 py-2 text-white ${
            !name?.trim() || selectedExercises.length === 0
              ? "cursor-not-allowed bg-gray-400"
              : "bg-emerald-500 hover:bg-emerald-600"
          }`}
        >
          <Save size={20} className="mr-2" />
          Save Workout
        </button>
      </div>
    </div>
  );
};

export default WorkoutForm;
