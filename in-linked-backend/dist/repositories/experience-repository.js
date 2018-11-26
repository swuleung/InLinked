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
const exceptions_1 = require("../utils/exceptions");
/**
 * CRUD functionality directly interfacing with the database
 *
 * @export
 * @class ExperienceRepository
 */
class ExperienceRepository {
    constructor(db) {
        this.TABLE_NAME = 'experience';
        this.db = db;
    }
    /* CRUD */
    insert(experience) {
        return __awaiter(this, void 0, void 0, function* () {
            const conn = yield this.db.getConnection();
            try {
                const res = yield conn.table(this.TABLE_NAME).insert({
                    UserId: experience.candidateId,
                    EnterpriseId: experience.enterpriseId,
                    EnterpriseName: experience.enterpriseName,
                    PositionName: experience.positionName,
                    Description: experience.description,
                    StartMonth: experience.startMonth,
                    StartYear: experience.startYear,
                    EndMonth: experience.endMonth,
                    EndYear: experience.endYear,
                    Location: experience.location
                });
                experience.experienceId = res[0];
                return experience;
            }
            catch (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    throw new exceptions_1.ValidationException(`Experience with id ${experience.experienceId} already exists`, err);
                }
                throw err; // Other errors
            }
        });
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const conn = yield this.db.getConnection();
            const row = yield conn
                .table(this.TABLE_NAME)
                .where({ ExperienceId: id })
                .first();
            if (!row) {
                throw new exceptions_1.NotFoundException(`The id '${id}' does not exist in the experience table.`);
            }
            return this.toModel(row);
        });
    }
    update(experience) {
        return __awaiter(this, void 0, void 0, function* () {
            const conn = yield this.db.getConnection();
            yield conn.table(this.TABLE_NAME)
                .where({ ExperienceId: experience.experienceId })
                .update({
                EnterpriseId: experience.enterpriseId,
                EnterpriseName: experience.enterpriseName,
                PositionName: experience.positionName,
                Description: experience.description,
                StartMonth: experience.startMonth,
                StartYear: experience.startYear,
                EndMonth: experience.endMonth,
                EndYear: experience.endYear,
                Location: experience.location
            });
            return experience;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.db.getTransaction();
            try {
                yield transaction.from(this.TABLE_NAME)
                    .delete()
                    .where({ ExperienceId: id });
                yield transaction.commit();
            }
            catch (err) {
                transaction.rollback(err);
                throw err;
            }
        });
    }
    /* CUSTOM FUNCTIONS */
    getByUser(userId, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const conn = yield this.db.getConnection();
            const row = yield conn
                .table(this.TABLE_NAME)
                .where({ UserId: userId })
                .orderBy('StartYear', 'desc')
                .orderBy('StartMonth', 'desc')
                .limit(limit || 30);
            if (!row) {
                throw new exceptions_1.NotFoundException(`The user id ${userId} does not have any experience.`);
            }
            return this.toModelList(row);
        });
    }
    toModel(row) {
        return {
            experienceId: row.ExperienceId,
            candidateId: row.UserId,
            enterpriseId: row.EnterpriseId,
            enterpriseName: row.EnterpriseName,
            positionName: row.PositionName,
            description: row.Description,
            startMonth: row.StartMonth,
            startYear: row.StartYear,
            endMonth: row.EndMonth,
            endYear: row.EndYear,
            location: row.Location
        };
    }
    toModelList(list) {
        // Assuming that the object passed in is a list
        return list.map((r) => this.toModel(r));
    }
}
exports.ExperienceRepository = ExperienceRepository;
//# sourceMappingURL=experience-repository.js.map