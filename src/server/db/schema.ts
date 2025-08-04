// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { index, pgTableCreator } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `workout-tracker_${name}`);

export const posts = createTable(
  "post",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 256 }),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("name_idx").on(t.name)]
);

export const exercises = createTable(
  "exercise",
  (d) => ({
    id: d.varchar({ length: 36 }).primaryKey(),
    name: d.varchar({ length: 256 }).notNull(),
    muscleGroup: d.varchar({ length: 64 }).notNull(),
    description: d.text().notNull(),
    tutorialUrl: d.varchar({ length: 512 }),
    imageUrl: d.varchar({ length: 512 }),
  }),
  (t) => [index("muscle_group_idx").on(t.muscleGroup)]
);

export const workouts = createTable(
  "workout",
  (d) => ({
    id: d.varchar({ length: 36 }).primaryKey(),
    name: d.varchar({ length: 256 }).notNull(),
    description: d.text(),
    duration: d.integer(), // in minutes
    difficulty: d.varchar({ length: 32 }), // beginner, intermediate, advanced
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("workout_name_idx").on(t.name)]
);

export const workoutExercises = createTable(
  "workout_exercise",
  (d) => ({
    id: d.varchar({ length: 36 }).primaryKey(),
    workoutId: d.varchar({ length: 36 }).notNull().references(() => workouts.id, { onDelete: "cascade" }),
    exerciseId: d.varchar({ length: 36 }).notNull().references(() => exercises.id, { onDelete: "cascade" }),
    sets: d.integer().notNull().default(3),
    reps: d.integer().notNull().default(10),
    restTime: d.integer().notNull().default(60), // in seconds
    order: d.integer().notNull().default(0), // for exercise order in workout
  }),
  (t) => [
    index("workout_exercise_workout_idx").on(t.workoutId),
    index("workout_exercise_exercise_idx").on(t.exerciseId),
    index("workout_exercise_order_idx").on(t.order),
  ]
);


