import { Middleware } from 'koa';
declare const requestStats: {
    totalRequests: number;
    statusCounts: Record<string, number>;
    pathCounts: Record<string, number>;
    lastRequestTime: string | null;
    responseTimes: number[];
    avgResponseTime: number;
};
declare const requestStatsMiddleware: Middleware;
export { requestStatsMiddleware, requestStats };
