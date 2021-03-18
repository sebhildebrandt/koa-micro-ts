import * as validators from './validators';
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
declare const app: App;
export { app, validators };
