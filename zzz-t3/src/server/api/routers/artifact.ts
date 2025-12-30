import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { artifactItself } from "~/server/db/schema";
import { eq, desc, count, and } from "drizzle-orm";

export const artifactRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        page: z.number().min(1).default(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const offset = (input.page - 1) * input.limit;

      const artifacts = await ctx.db.query.artifactItself.findMany({
        where: eq(artifactItself.userId, ctx.session.user.id),
        orderBy: [desc(artifactItself.createDate), desc(artifactItself.id)],
        limit: input.limit,
        offset: offset,
        with: {
          leveling: true,
        },
      });

      const [total] = await ctx.db
        .select({ count: count() })
        .from(artifactItself)
        .where(eq(artifactItself.userId, ctx.session.user.id));

      return {
        artifacts,
        totalCount: total?.count ?? 0,
        totalPages: Math.ceil((total?.count ?? 0) / input.limit),
      };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        set: z.string(),
        type: z.string(),
        mainStat: z.string(),
        numberOfSubstats: z.number().int().min(3).max(4),
        substats: z.array(z.string()),
        score: z.string(),
        source: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(artifactItself)
        .set({
          set: input.set,
          type: input.type,
          mainStat: input.mainStat,
          numberOfSubstat: input.numberOfSubstats,
          whereGotIt: input.source,
          score: input.score,
          percentATK: input.substats.includes("%ATK") ? 1 : 0,
          percentHP: input.substats.includes("%HP") ? 1 : 0,
          percentDEF: input.substats.includes("%DEF") ? 1 : 0,
          atk: input.substats.includes("ATK") ? 1 : 0,
          hp: input.substats.includes("HP") ? 1 : 0,
          def: input.substats.includes("DEF") ? 1 : 0,
          pen: input.substats.includes("PEN") ? 1 : 0,
          ap: input.substats.includes("AP") ? 1 : 0,
          critRate: input.substats.includes("Crit Rate") ? 1 : 0,
          critDMG: input.substats.includes("Crit DMG") ? 1 : 0,
        })
        .where(
          and(
            eq(artifactItself.id, input.id),
            eq(artifactItself.userId, ctx.session.user.id),
          ),
        );
    }),


  create: protectedProcedure
    .input(
      z.object({
        set: z.string(),
        type: z.string(),
        mainStat: z.string(),
        numberOfSubstats: z.number().int().min(3).max(4),
        substats: z.array(z.string()),
        score: z.string(),
        source: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // 1. Create the artifact entry
      const [newArtifact] = await ctx.db
        .insert(artifactItself)
        .values({
          userId: ctx.session.user.id,
          set: input.set,
          type: input.type,
          mainStat: input.mainStat,
          numberOfSubstat: input.numberOfSubstats,
          whereGotIt: input.source,
          score: input.score,
          // Map substats array to individual columns
          percentATK: input.substats.includes("%ATK") ? 1 : 0,
          percentHP: input.substats.includes("%HP") ? 1 : 0,
          percentDEF: input.substats.includes("%DEF") ? 1 : 0,
          atk: input.substats.includes("ATK") ? 1 : 0,
          hp: input.substats.includes("HP") ? 1 : 0,
          def: input.substats.includes("DEF") ? 1 : 0,
          pen: input.substats.includes("PEN") ? 1 : 0,
          ap: input.substats.includes("AP") ? 1 : 0,
          critRate: input.substats.includes("Crit Rate") ? 1 : 0,
          critDMG: input.substats.includes("Crit DMG") ? 1 : 0,
        })
        .returning({ id: artifactItself.id });

      if (!newArtifact) {
        throw new Error("Failed to create artifact");
      }

      return newArtifact;
    }),

  search: protectedProcedure
    .input(
      z.object({
        set: z.string().nullable().optional(),
        type: z.string().nullable().optional(),
        mainStat: z.string().nullable().optional(),
        numberOfSubstats: z.number().nullable().optional(),
        substats: z.array(z.string()).optional(),
        score: z.string().nullable().optional(),
        source: z.string().nullable().optional(),
        limit: z.number().min(1).max(100).default(10),
        page: z.number().min(1).default(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const offset = (input.page - 1) * input.limit;
      const filters = [eq(artifactItself.userId, ctx.session.user.id)];

      if (input.set) filters.push(eq(artifactItself.set, input.set));
      if (input.type) filters.push(eq(artifactItself.type, input.type));
      if (input.mainStat) filters.push(eq(artifactItself.mainStat, input.mainStat));
      if (input.numberOfSubstats)
        filters.push(eq(artifactItself.numberOfSubstat, input.numberOfSubstats));
      if (input.score) filters.push(eq(artifactItself.score, input.score));
      if (input.source) filters.push(eq(artifactItself.whereGotIt, input.source));

      if (input.substats && input.substats.length > 0) {
        if (input.substats.includes("%ATK"))
          filters.push(eq(artifactItself.percentATK, 1));
        if (input.substats.includes("%HP"))
          filters.push(eq(artifactItself.percentHP, 1));
        if (input.substats.includes("%DEF"))
          filters.push(eq(artifactItself.percentDEF, 1));
        if (input.substats.includes("ATK"))
          filters.push(eq(artifactItself.atk, 1));
        if (input.substats.includes("HP"))
          filters.push(eq(artifactItself.hp, 1));
        if (input.substats.includes("DEF"))
          filters.push(eq(artifactItself.def, 1));
        if (input.substats.includes("PEN"))
          filters.push(eq(artifactItself.pen, 1));
        if (input.substats.includes("AP"))
          filters.push(eq(artifactItself.ap, 1));
        if (input.substats.includes("Crit Rate"))
          filters.push(eq(artifactItself.critRate, 1));
        if (input.substats.includes("Crit DMG"))
          filters.push(eq(artifactItself.critDMG, 1));
      }

      const artifacts = await ctx.db.query.artifactItself.findMany({
        where: and(...filters),
        orderBy: [desc(artifactItself.createDate)],
        limit: input.limit,
        offset: offset,
        with: {
          leveling: true,
        },
      });

      const [total] = await ctx.db
        .select({ count: count() })
        .from(artifactItself)
        .where(and(...filters));

      return {
        artifacts,
        totalCount: total?.count ?? 0,
        totalPages: Math.ceil((total?.count ?? 0) / input.limit),
      };
    }),
});
