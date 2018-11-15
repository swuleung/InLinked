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
            try {
                return yield this.repo.insert(experience);
            }
            catch (ex) {
                return ex.toObject();
            }
        });
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repo.get(id);
            }
            catch (ex) {
                return ex.toObject();
            }
        });
    }
    update(experience) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repo.update(experience);
            }
            catch (ex) {
                return ex.toObject();
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repo.delete(id);
            }
            catch (ex) {
                return ex.toObject();
            }
        });
    }
    /* OTHER */
    getByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repo.getByUser(userId);
            }
            catch (ex) {
                return ex.toObject();
            }
        });
    }
}
exports.ExperienceManager = ExperienceManager;
//# sourceMappingURL=experience-manager.js.map