"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* Import controllers */
const Controllers = require("../controllers");
class Routes {
    constructor(app, module) {
        this.testController = new Controllers.TestController();
        this.userController = new Controllers.UserController(module.managers.user);
        // Bind routes
        this.testController.bindRoutes(app);
        this.userController.bindRoutes(app);
    }
}
exports.Routes = Routes;
//# sourceMappingURL=routes.js.map