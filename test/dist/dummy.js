"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const application_js_1 = require("../../dist/application.js");
const a = 1;
console.log('DUMMY TEST');
console.log(a);
application_js_1.app.health('/health');
application_js_1.app.use((ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.body = { hello: 'world' };
}));
application_js_1.app.gracefulShutdown({
    finally() {
        console.log('Server gracefulls shutted down.....');
    }
});
application_js_1.app.start(3000);
//# sourceMappingURL=dummy.js.map