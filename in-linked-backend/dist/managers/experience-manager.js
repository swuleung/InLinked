"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class ExperienceManager {
    constructor(repo) {
        this.repo = repo;
    }
    /* CRUD */
    create(experience) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repo.insert(experience);
        });
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repo.get(id);
        });
    }
    update(experience) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repo.update(experience);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repo.delete(id);
        });
    }
    /* OTHER */
    getByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repo.getByUser(userId);
        });
    }
}
exports.ExperienceManager = ExperienceManager;
//# sourceMappingURL=experience-manager.js.map