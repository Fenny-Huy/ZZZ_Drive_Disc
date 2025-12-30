// import { postRouter } from "~/server/api/routers/post";
import { artifactRouter } from "~/server/api/routers/artifact";
import { levelingRouter } from "~/server/api/routers/leveling";
import { statisticsRouter } from "~/server/api/routers/statistics";
import { substatisticsRouter } from "~/server/api/routers/substatistics";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  artifact: artifactRouter,
  leveling: levelingRouter,
  statistics: statisticsRouter,
  substatistics: substatisticsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
