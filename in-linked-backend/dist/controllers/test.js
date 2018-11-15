"use strict";
/**
 * Test controller
 * PLEASE TEST ME
 */
Object.defineProperty(exports, "__esModule", { value: true });
/* Import services being used */
class TestController {
    add(req, res, next) {
        res.json('Create hit!');
    }
    get(req, res, next) {
        res.json('Get hit!');
    }
    update(req, res, next) {
        res.json('Update hit!');
    }
    delete(req, res, next) {
        res.json('Delete hit!');
    }
    /**
     * Bind the different functions to routes
     * @param app Express app to bind the routes to
     */
    bindRoutes(app) {
        app.route('/test')
            .post(this.add.bind(this))
            .get(this.get.bind(this));
        app.route('/test/:num')
            .put(this.update.bind(this))
            .delete(this.delete.bind(this));
    }
}
exports.TestController = TestController;
//# sourceMappingURL=test.js.map