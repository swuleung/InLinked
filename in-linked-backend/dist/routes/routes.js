"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* Import controllers */
const Controllers = require("../controllers");
class Routes {
    constructor(app, module) {
        this.testController = new Controllers.TestController();
        this.userController = new Controllers.UserController(module.managers.user, module.managers.candidate, module.managers.enterprise);
        // Bind routes
        this.testController.bindRoutes(app);
        this.userController.bindRoutes(app, module);
    }
}
exports.Routes = Routes;
//# sourceMappingURL=routes.js.map