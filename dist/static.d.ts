import { StaticServeOptions } from "./app.interface";
declare function serve(root: string, opts?: StaticServeOptions): (ctx: any, next: any) => Promise<void>;
export { serve };
