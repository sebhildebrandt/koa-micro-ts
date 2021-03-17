// Type definitions

import * as Koa from "koa";

export namespace KoaMicro {

  interface App {
    health: any;
    use: any;
    gracefulShutdown: any;
    start: any;
    static: any;
    cors: any;
    jwt: any;
    newRouter: any;
    useRouter: any;
    autoRoute: any;
    helmet: any;
    listen: any;
  }
}
export const app: KoaMicro.App;

