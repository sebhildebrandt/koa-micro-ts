import { Middleware } from 'koa';


const average = (arr: number[]) => { return arr.reduce((p, c) => p + c, 0) / arr.length; };

// Global store for request statistics
const requestStats = {
  totalRequests: 0,
  statusCounts: {} as Record<string, number>,
  pathCounts: {} as Record<string, number>,
  lastRequestTime: null as string | null,
  responseTimes: [] as number[],
  avgResponseTime: 0
};

const requestStatsMiddleware: Middleware = async (ctx, next) => {
  // Increment total request count
  requestStats.totalRequests++;

  // Track request method counts
  // const method = ctx.method;
  const start = new Date();

  // proceed request
  await next();

  const ms = Math.ceil(new Date().valueOf() - start.valueOf());
  const statustype = Math.floor(ctx.status / 100).toString() + 'xx';
  requestStats.responseTimes.push(ms);
  // max first 100 request times
  if (requestStats.responseTimes.length > 100) {
    requestStats.responseTimes.shift();
  }
  requestStats.avgResponseTime = average(requestStats.responseTimes);

  requestStats.statusCounts[statustype] = (requestStats.statusCounts[statustype] || 0) + 1;

  // Track request path counts
  const path = ctx.path;
  requestStats.pathCounts[path] = (requestStats.pathCounts[path] || 0) + 1;

  // Track last request timestamp
  requestStats.lastRequestTime = new Date().toISOString();

};

export { requestStats, requestStatsMiddleware };

