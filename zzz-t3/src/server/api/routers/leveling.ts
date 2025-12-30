import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { artifactItself, artifactLeveling } from "~/server/db/schema";
import { eq, and, desc, count, or, type SQL } from "drizzle-orm";

export const levelingRouter = createTRPCRouter({
  search: protectedProcedure
    .input(
      z.object({
        // Artifact filters
        set: z.string().nullable().optional(),
        type: z.string().nullable().optional(),
        mainStat: z.string().nullable().optional(),
        numberOfSubstats: z.number().nullable().optional(),
        score: z.string().nullable().optional(),
        source: z.string().nullable().optional(),
        substats: z.array(z.string()).optional(),

        // Leveling filters (exact match)
        lHP: z.number().nullable().optional(),
        lATK: z.number().nullable().optional(),
        lDEF: z.number().nullable().optional(),
        lPercentHP: z.number().nullable().optional(),
        lPercentATK: z.number().nullable().optional(),
        lPercentDEF: z.number().nullable().optional(),
        lEM: z.number().nullable().optional(),
        lER: z.number().nullable().optional(),
        lCritRate: z.number().nullable().optional(),
        lCritDMG: z.number().nullable().optional(),

        limit: z.number().min(1).max(100).default(10),
        page: z.number().min(1).default(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const offset = (input.page - 1) * input.limit;

      const filters: SQL[] = [eq(artifactItself.userId, ctx.session.user.id)];

      // Artifact filters
      if (input.set) filters.push(eq(artifactItself.set, input.set));
      if (input.type) filters.push(eq(artifactItself.type, input.type));
      if (input.mainStat) filters.push(eq(artifactItself.mainStat, input.mainStat));
      if (input.numberOfSubstats)
        filters.push(eq(artifactItself.numberOfSubstat, input.numberOfSubstats));
      if (input.score) filters.push(eq(artifactItself.score, input.score));
      if (input.source) filters.push(eq(artifactItself.whereGotIt, input.source));

      if (input.substats && input.substats.length > 0) {
        if (input.substats.includes("%ATK")) {
          const condition = or(
            eq(artifactItself.percentATK, 1),
            eq(artifactLeveling.addedSubstat, "%ATK"),
          );
          if (condition) filters.push(condition);
        }
        if (input.substats.includes("%HP")) {
          const condition = or(
            eq(artifactItself.percentHP, 1),
            eq(artifactLeveling.addedSubstat, "%HP"),
          );
          if (condition) filters.push(condition);
        }
        if (input.substats.includes("%DEF")) {
          const condition = or(
            eq(artifactItself.percentDEF, 1),
            eq(artifactLeveling.addedSubstat, "%DEF"),
          );
          if (condition) filters.push(condition);
        }
        if (input.substats.includes("ATK")) {
          const condition = or(
            eq(artifactItself.atk, 1),
            eq(artifactLeveling.addedSubstat, "ATK"),
          );
          if (condition) filters.push(condition);
        }
        if (input.substats.includes("HP")) {
          const condition = or(
            eq(artifactItself.hp, 1),
            eq(artifactLeveling.addedSubstat, "HP"),
          );
          if (condition) filters.push(condition);
        }
        if (input.substats.includes("DEF")) {
          const condition = or(
            eq(artifactItself.def, 1),
            eq(artifactLeveling.addedSubstat, "DEF"),
          );
          if (condition) filters.push(condition);
        }
        if (input.substats.includes("ER")) {
          const condition = or(
            eq(artifactItself.er, 1),
            eq(artifactLeveling.addedSubstat, "ER"),
          );
          if (condition) filters.push(condition);
        }
        if (input.substats.includes("EM")) {
          const condition = or(
            eq(artifactItself.em, 1),
            eq(artifactLeveling.addedSubstat, "EM"),
          );
          if (condition) filters.push(condition);
        }
        if (input.substats.includes("Crit Rate")) {
          const condition = or(
            eq(artifactItself.critRate, 1),
            eq(artifactLeveling.addedSubstat, "Crit Rate"),
          );
          if (condition) filters.push(condition);
        }
        if (input.substats.includes("Crit DMG")) {
          const condition = or(
            eq(artifactItself.critDMG, 1),
            eq(artifactLeveling.addedSubstat, "Crit DMG"),
          );
          if (condition) filters.push(condition);
        }
      }

      // Leveling filters
      if (input.lHP !== null && input.lHP !== undefined)
        filters.push(eq(artifactLeveling.lHP, input.lHP));
      if (input.lATK !== null && input.lATK !== undefined)
        filters.push(eq(artifactLeveling.lATK, input.lATK));
      if (input.lDEF !== null && input.lDEF !== undefined)
        filters.push(eq(artifactLeveling.lDEF, input.lDEF));
      if (input.lPercentHP !== null && input.lPercentHP !== undefined)
        filters.push(eq(artifactLeveling.lPercentHP, input.lPercentHP));
      if (input.lPercentATK !== null && input.lPercentATK !== undefined)
        filters.push(eq(artifactLeveling.lPercentATK, input.lPercentATK));
      if (input.lPercentDEF !== null && input.lPercentDEF !== undefined)
        filters.push(eq(artifactLeveling.lPercentDEF, input.lPercentDEF));
      if (input.lEM !== null && input.lEM !== undefined)
        filters.push(eq(artifactLeveling.lEM, input.lEM));
      if (input.lER !== null && input.lER !== undefined)
        filters.push(eq(artifactLeveling.lER, input.lER));
      if (input.lCritRate !== null && input.lCritRate !== undefined)
        filters.push(eq(artifactLeveling.lCritRate, input.lCritRate));
      if (input.lCritDMG !== null && input.lCritDMG !== undefined)
        filters.push(eq(artifactLeveling.lCritDMG, input.lCritDMG));

      const results = await ctx.db
        .select({
          artifact: artifactItself,
          leveling: artifactLeveling,
        })
        .from(artifactLeveling)
        .innerJoin(artifactItself, eq(artifactLeveling.id, artifactItself.id))
        .where(and(...filters))
        .limit(input.limit)
        .offset(offset)
        .orderBy(desc(artifactLeveling.lastAdded));

      const [total] = await ctx.db
        .select({ count: count() })
        .from(artifactLeveling)
        .innerJoin(artifactItself, eq(artifactLeveling.id, artifactItself.id))
        .where(and(...filters));

      return {
        results,
        totalCount: total?.count ?? 0,
        totalPages: Math.ceil((total?.count ?? 0) / input.limit),
      };
    }),

  updateLeveling: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        lHP: z.number().default(0),
        lATK: z.number().default(0),
        lDEF: z.number().default(0),
        lPercentHP: z.number().default(0),
        lPercentATK: z.number().default(0),
        lPercentDEF: z.number().default(0),
        lEM: z.number().default(0),
        lER: z.number().default(0),
        lCritRate: z.number().default(0),
        lCritDMG: z.number().default(0),
        addedSubstat: z.string().default("None"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Verify ownership via artifactItself join or just trust the ID if we check existence?
      // Better to check ownership.
      const artifact = await ctx.db.query.artifactItself.findFirst({
        where: and(
          eq(artifactItself.id, input.id),
          eq(artifactItself.userId, ctx.session.user.id),
        ),
      });

      if (!artifact) {
        throw new Error("Artifact not found or unauthorized");
      }

      await ctx.db
        .insert(artifactLeveling)
        .values({
          id: input.id,
          lHP: input.lHP,
          lATK: input.lATK,
          lDEF: input.lDEF,
          lPercentHP: input.lPercentHP,
          lPercentATK: input.lPercentATK,
          lPercentDEF: input.lPercentDEF,
          lEM: input.lEM,
          lER: input.lER,
          lCritRate: input.lCritRate,
          lCritDMG: input.lCritDMG,
          addedSubstat: input.addedSubstat,
          lastAdded: new Date(),
        })
        .onConflictDoUpdate({
          target: artifactLeveling.id,
          set: {
            lHP: input.lHP,
            lATK: input.lATK,
            lDEF: input.lDEF,
            lPercentHP: input.lPercentHP,
            lPercentATK: input.lPercentATK,
            lPercentDEF: input.lPercentDEF,
            lEM: input.lEM,
            lER: input.lER,
            lCritRate: input.lCritRate,
            lCritDMG: input.lCritDMG,
            addedSubstat: input.addedSubstat,
            lastAdded: new Date(),
          },
        });
    }),
});
