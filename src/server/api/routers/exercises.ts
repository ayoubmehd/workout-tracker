import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const exerciseRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const exercises = await ctx.db.query.exercises.findMany();

    return exercises ?? null;
  }),
  create: publicProcedure.input(z.object({
    name: z.string(),
    description: z.string().optional(),
    exercises: z.array(z.string())
  })).mutation(async ({ ctx }) => {

  })
});
