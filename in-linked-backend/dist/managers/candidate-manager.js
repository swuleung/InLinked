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
/**
 * Manages candidate information that is tied to the user
 */
class CandidateManager {
    constructor(repo, auth, hash) {
        this.repo = repo;
        this.auth = auth;
        this.hash = hash;
    }
    /* CRUD */
    create(candidate) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repo.insert(candidate);
        });
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repo.get(id);
        });
    }
    update(candidate) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repo.update(candidate);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repo.delete(id);
        });
    }
}
exports.CandidateManager = CandidateManager;
//# sourceMappingURL=candidate-manager.js.map