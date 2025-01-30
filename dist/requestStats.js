"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestStats = exports.requestStatsMiddleware = void 0;
const average = (arr) => { return arr.reduce((p, c) => p + c, 0) / arr.length; };
const requestStats = {
    totalRequests: 0,
    statusCounts: {},
    pathCounts: {},
    lastRequestTime: null,
    responseTimes: [],
    avgResponseTime: 0
};
exports.requestStats = requestStats;
const requestStatsMiddleware = async (ctx, next) => {
    requestStats.totalRequests++;
    const start = new Date();
    await next();
    const ms = Math.ceil(new Date().valueOf() - start.valueOf());
    const statustype = Math.floor(ctx.status / 100).toString();
    requestStats.responseTimes.push(ms);
    if (requestStats.responseTimes.length > 100) {
        requestStats.responseTimes.shift();
    }
    requestStats.avgResponseTime = average(requestStats.responseTimes);
    requestStats.statusCounts[statustype] = (requestStats.statusCounts[statustype] || 0) + 1;
    const path = ctx.path;
    requestStats.pathCounts[path] = (requestStats.pathCounts[path] || 0) + 1;
    requestStats.lastRequestTime = new Date().toISOString();
};
exports.requestStatsMiddleware = requestStatsMiddleware;
//# sourceMappingURL=requestStats.js.map