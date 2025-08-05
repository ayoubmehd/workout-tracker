import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { workouts, workoutExercises, exercises } from "~/server/db/schema";
import { eq, and, inArray } from "drizzle-orm";

export const workoutRouter = createTRPCRouter({
  // Get all workouts
  getAll: publicProcedure.query(async ({ ctx }) => {
    const allWorkouts = await ctx.db.select().from(workouts);

    return allWorkouts;
  }),

  // Get workout by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const workout = await ctx.db.query.workouts.findFirst({
        where: eq(workouts.id, input.id),
      });

      return workout;
    }),
  

  getExercisesByWorkoutId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const exercisesData = await ctx.db.select({
        id: exercises.id,
        name: exercises.name,
        muscleGroup: exercises.muscleGroup,
        description: exercises.description,
        tutorialUrl: exercises.tutorialUrl,
        imageUrl: exercises.imageUrl,
        sets: workoutExercises.sets,
        reps: workoutExercises.reps,
        weight: workoutExercises.weight,
      }).from(exercises).leftJoin(workoutExercises, eq(exercises.id, workoutExercises.exerciseId)).where(eq(workoutExercises.workoutId, input.id));
      return exercisesData;
    }),

  // Create a new workout
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        duration: z.number().optional(),
        difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
        exercises: z.array(
          z.object({
            exerciseId: z.string(),
            sets: z.number().min(1).default(3),
            reps: z.number().min(1).default(10),
            restTime: z.number().min(0).default(60),
            order: z.number().min(0).default(0),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const workoutId = crypto.randomUUID();

      // Create the workout
      await ctx.db.insert(workouts).values({
        id: workoutId,
        name: input.name,
        description: input.description,
        duration: input.duration,
        difficulty: input.difficulty,
      });

      // Create workout exercises if provided
      if (input.exercises.length > 0) {
        const workoutExerciseValues = input.exercises.map((exercise, index) => ({
          id: crypto.randomUUID(),
          workoutId,
          exerciseId: exercise.exerciseId,
          sets: exercise.sets,
          reps: exercise.reps,
          restTime: exercise.restTime,
          order: exercise.order || index,
        }));

        await ctx.db.insert(workoutExercises).values(workoutExerciseValues);
      }

      return { id: workoutId };
    }),

  // Update a workout
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        duration: z.number().optional(),
        difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
        exercises: z.array(
          z.object({
            exerciseId: z.string(),
            sets: z.number().min(1).default(3),
            reps: z.number().min(1).default(10),
            restTime: z.number().min(0).default(60),
            order: z.number().min(0).default(0),
          })
        ).optional(),
        exercisesToDelete: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      await ctx.db
        .update(workouts)
        .set(updateData)
        .where(eq(workouts.id, id));
      
      // Create workout exercises if provided
      if (input.exercises?.length) {
        const workoutExerciseValues = input.exercises.map((exercise, index) => ({
          id: crypto.randomUUID(),
          workoutId: id,
          exerciseId: exercise.exerciseId,
          sets: exercise.sets,
          reps: exercise.reps,
          restTime: exercise.restTime,
          order: exercise.order || index,
        }));

        await ctx.db.insert(workoutExercises).values(workoutExerciseValues);
      }

      if (input.exercisesToDelete?.length) {
        await ctx.db
          .delete(workoutExercises)
          .where(
            and(
              inArray(workoutExercises.exerciseId, input.exercisesToDelete),
              eq(workoutExercises.workoutId, id),
            ),
          );
      }

      return { success: true };
    }),

  // Delete a workout
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Delete workout exercises first (cascade should handle this, but being explicit)
      await ctx.db
        .delete(workoutExercises)
        .where(eq(workoutExercises.workoutId, input.id));

      // Delete the workout
      await ctx.db.delete(workouts).where(eq(workouts.id, input.id));

      return { success: true };
    }),

  // Add exercise to workout
  addExercise: publicProcedure
    .input(
      z.object({
        workoutId: z.string(),
        exerciseId: z.string(),
        sets: z.number().min(1).default(3),
        reps: z.number().min(1).default(10),
        restTime: z.number().min(0).default(60),
        order: z.number().min(0).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Get the current max order for this workout
      const maxOrderResult = await ctx.db
        .select({ maxOrder: workoutExercises.order })
        .from(workoutExercises)
        .where(eq(workoutExercises.workoutId, input.workoutId))
        .orderBy(workoutExercises.order)
        .limit(1);

      const order = input.order ?? (maxOrderResult[0]?.maxOrder ?? 0) + 1;

      await ctx.db.insert(workoutExercises).values({
        id: crypto.randomUUID(),
        workoutId: input.workoutId,
        exerciseId: input.exerciseId,
        sets: input.sets,
        reps: input.reps,
        restTime: input.restTime,
        order,
      });

      return { success: true };
    }),

  // Remove exercise from workout
  removeExercise: publicProcedure
    .input(
      z.object({
        workoutId: z.string(),
        exerciseId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(workoutExercises)
        .where(
          and(
            eq(workoutExercises.workoutId, input.workoutId),
            eq(workoutExercises.exerciseId, input.exerciseId)
          )
        );

      return { success: true };
    }),

  // Update workout exercise
  updateExercise: publicProcedure
    .input(
      z.object({
        workoutId: z.string(),
        exerciseId: z.string(),
        sets: z.number().min(1).optional(),
        reps: z.number().min(1).optional(),
        restTime: z.number().min(0).optional(),
        order: z.number().min(0).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { workoutId, exerciseId, ...updateData } = input;

      await ctx.db
        .update(workoutExercises)
        .set(updateData)
        .where(
          and(
            eq(workoutExercises.workoutId, workoutId),
            eq(workoutExercises.exerciseId, exerciseId)
          )
        );

      return { success: true };
    }),
}); 