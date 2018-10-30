"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Main route files containing other routes/controllers
 */
const express_1 = require("express");
/* Import controllers */
const Controllers = require("../controllers");
const router = express_1.Router();
router.get('/', Controllers.TestController);
class Routes {
    constructor(app) {
        this.testController = new Controllers.TestController();
        // Bind routes
        this.testController.bindRoute(app);
    }
}
exports.Routes = Routes;
//# sourceMappingURL=routes.js.map