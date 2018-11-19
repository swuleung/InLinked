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
const auth_1 = require("../utils/lib/auth");
const exceptions_1 = require("../utils/exceptions");
class ExperienceManager {
    constructor(experienceRepo, userRepo) {
        this.experienceRepo = experienceRepo;
        this.userRepo = userRepo;
    }
    /* CRUD */
    create(experience) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if corresponding candidateId is a candidate
            const user = yield this.userRepo.get(experience.candidateId);
            if (user.acctype !== auth_1.AccType.CANDIDATE) {
                throw new exceptions_1.InvalidFieldException(`The provided candidateId for the experience does not correspond to a candidate!`, [{
                        fieldName: 'experience.candidateId',
                        type: 'number'
                    }]);
            }
            // Only if enterpriseId is present
            if (experience.enterpriseId) {
                // Check if corresponding enterpriseId as an enterprise
                const user = yield this.userRepo.get(experience.enterpriseId);
                if (user.acctype !== auth_1.AccType.ENTERPRISE) {
                    throw new exceptions_1.InvalidFieldException(`The provided enterpriseId for the experience does not correspond to an enterprise!`, [{
                            fieldName: 'experience.enterpriseId',
                            type: 'number'
                        }]);
                }
            }
            return yield this.experienceRepo.insert(experience);
        });
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.experienceRepo.get(id);
        });
    }
    update(experience) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.experienceRepo.update(experience);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.experienceRepo.delete(id);
        });
    }
    /* OTHER */
    getByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.experienceRepo.getByUser(userId);
        });
    }
}
exports.ExperienceManager = ExperienceManager;
//# sourceMappingURL=experience-manager.js.map