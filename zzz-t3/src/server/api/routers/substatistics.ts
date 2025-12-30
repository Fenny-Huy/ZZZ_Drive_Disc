import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { artifactItself, artifactLeveling } from "~/server/db/schema";
import { sql, desc, eq } from "drizzle-orm";

export const substatisticsRouter = createTRPCRouter({
  getSetData: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db
      .select({
        set: artifactItself.set,
        count: sql<number>`count(*)`.mapWith(Number),
      })
      .from(artifactItself)
      .where(eq(artifactItself.userId, ctx.session.user.id))
      .groupBy(artifactItself.set)
      .orderBy(desc(sql`count(*)`));
    return result;
  }),

  getSourceData: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db
      .select({
        where: artifactItself.whereGotIt,
        count: sql<number>`count(*)`.mapWith(Number),
      })
      .from(artifactItself)
      .where(eq(artifactItself.userId, ctx.session.user.id))
      .groupBy(artifactItself.whereGotIt)
      .orderBy(desc(sql`count(*)`));
    return result;
  }),

  getSetSourceComboData: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db
      .select({
        set: artifactItself.set,
        where: artifactItself.whereGotIt,
        count: sql<number>`count(*)`.mapWith(Number),
      })
      .from(artifactItself)
      .where(eq(artifactItself.userId, ctx.session.user.id))
      .groupBy(artifactItself.set, artifactItself.whereGotIt)
      .orderBy(desc(sql`count(*)`));
    return result;
  }),

  getScoreData: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db
      .select({
        score: artifactItself.score,
        count: sql<number>`count(*)`.mapWith(Number),
      })
      .from(artifactItself)
      .where(eq(artifactItself.userId, ctx.session.user.id))
      .groupBy(artifactItself.score)
      .orderBy(desc(sql`count(*)`));
    return result;
  }),

  getScoreSetData: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db
      .select({
        score: artifactItself.score,
        set: artifactItself.set,
        count: sql<number>`count(*)`.mapWith(Number),
      })
      .from(artifactItself)
      .where(eq(artifactItself.userId, ctx.session.user.id))
      .groupBy(artifactItself.score, artifactItself.set)
      .orderBy(desc(sql`count(*)`));
    return result;
  }),

  getScoreSourceData: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db
      .select({
        score: artifactItself.score,
        where: artifactItself.whereGotIt,
        count: sql<number>`count(*)`.mapWith(Number),
      })
      .from(artifactItself)
      .where(eq(artifactItself.userId, ctx.session.user.id))
      .groupBy(artifactItself.score, artifactItself.whereGotIt)
      .orderBy(desc(sql`count(*)`));
    return result;
  }),

  getScoreSetSourceData: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db
      .select({
        score: artifactItself.score,
        set: artifactItself.set,
        where: artifactItself.whereGotIt,
        count: sql<number>`count(*)`.mapWith(Number),
      })
      .from(artifactItself)
      .where(eq(artifactItself.userId, ctx.session.user.id))
      .groupBy(artifactItself.score, artifactItself.set, artifactItself.whereGotIt)
      .orderBy(desc(sql`count(*)`));
    return result;
  }),

  getLevelingInvestmentData: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db
      .select({
        type: artifactItself.type,
        set: artifactItself.set,
        artifactCount: sql<number>`count(*)`.mapWith(Number),
        totalRolls: sql<number>`sum(
          ${artifactLeveling.lHP} + 
          ${artifactLeveling.lATK} + 
          ${artifactLeveling.lDEF} + 
          ${artifactLeveling.lPercentHP} + 
          ${artifactLeveling.lPercentATK} + 
          ${artifactLeveling.lPercentDEF} + 
          ${artifactLeveling.lAP} + 
          ${artifactLeveling.lPEN} + 
          ${artifactLeveling.lCritRate} + 
          ${artifactLeveling.lCritDMG}
        )`.mapWith(Number),
      })
      .from(artifactLeveling)
      .innerJoin(artifactItself, eq(artifactLeveling.id, artifactItself.id))
      .where(eq(artifactItself.userId, ctx.session.user.id))
      .groupBy(artifactItself.type, artifactItself.set)
      .orderBy(desc(sql`sum(
          ${artifactLeveling.lHP} + 
          ${artifactLeveling.lATK} + 
          ${artifactLeveling.lDEF} + 
          ${artifactLeveling.lPercentHP} + 
          ${artifactLeveling.lPercentATK} + 
          ${artifactLeveling.lPercentDEF} + 
          ${artifactLeveling.lAP} + 
          ${artifactLeveling.lPEN} + 
          ${artifactLeveling.lCritRate} + 
          ${artifactLeveling.lCritDMG}
        )`));
    return result;
  }),
});
