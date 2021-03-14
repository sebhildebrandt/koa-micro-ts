// Type definitions

export namespace KoaMicro {

  interface App {
    health: any;
    use: any;
    gracefulShutdown: any;
    start: any;
    cors: any;
    jwt: any;
    newRouter: any;
    useRouter: any;
    helmet: any;
    listen: any;
  }
}
export const app: KoaMicro.App;
