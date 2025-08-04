CREATE TABLE "workout-tracker_workout_exercise" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"workoutId" varchar(36) NOT NULL,
	"exerciseId" varchar(36) NOT NULL,
	"sets" integer DEFAULT 3 NOT NULL,
	"reps" integer DEFAULT 10 NOT NULL,
	"restTime" integer DEFAULT 60 NOT NULL,
	"order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workout-tracker_workout" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" text,
	"duration" integer,
	"difficulty" varchar(32),
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "workout-tracker_workout_exercise" ADD CONSTRAINT "workout-tracker_workout_exercise_workoutId_workout-tracker_workout_id_fk" FOREIGN KEY ("workoutId") REFERENCES "public"."workout-tracker_workout"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout-tracker_workout_exercise" ADD CONSTRAINT "workout-tracker_workout_exercise_exerciseId_workout-tracker_exercise_id_fk" FOREIGN KEY ("exerciseId") REFERENCES "public"."workout-tracker_exercise"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "workout_exercise_workout_idx" ON "workout-tracker_workout_exercise" USING btree ("workoutId");--> statement-breakpoint
CREATE INDEX "workout_exercise_exercise_idx" ON "workout-tracker_workout_exercise" USING btree ("exerciseId");--> statement-breakpoint
CREATE INDEX "workout_exercise_order_idx" ON "workout-tracker_workout_exercise" USING btree ("order");--> statement-breakpoint
CREATE INDEX "workout_name_idx" ON "workout-tracker_workout" USING btree ("name");