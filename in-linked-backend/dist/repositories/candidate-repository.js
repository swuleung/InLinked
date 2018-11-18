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
class CandidateRepository {
    constructor(db) {
        this.TABLE_NAME = 'candidate';
        this.db = db;
    }
    insert(candidate) {
        return __awaiter(this, void 0, void 0, function* () {
            const conn = yield this.db.getConnection();
            try {
                const res = yield conn.table(this.TABLE_NAME).insert({
                    CandidateId: candidate.candidateId,
                    FullName: candidate.fullName,
                    Skills: candidate.skills,
                    EducationLevel: candidate.educationLevel,
                    DisplayEmail: candidate.displayEmail
                });
                return candidate;
            }
            catch (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    throw new exceptions_1.ValidationException(`The user ${candidate.candidateId} already exists.`, err);
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
                .where({ CandidateId: id })
                .first();
            if (!row) {
                throw new exceptions_1.NotFoundException(`The id '${id}' does not exist in the candidates table.`);
            }
            return this.toModel(row);
        });
    }
    update(candidate) {
        return __awaiter(this, void 0, void 0, function* () {
            const conn = yield this.db.getConnection();
            yield conn.table(this.TABLE_NAME)
                .where({ CandidateId: candidate.candidateId })
                .update({
                FullName: candidate.fullName,
                Skills: candidate.skills,
                EducationLevel: candidate.educationLevel,
                DisplayEmail: candidate.displayEmail
            });
            return candidate;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.db.getTransaction();
            try {
                yield transaction.from(this.TABLE_NAME)
                    .delete()
                    .where({ CandidateId: id });
                yield transaction.commit();
            }
            catch (err) {
                // Error in transaction, roll back
                transaction.rollback(err);
                throw err;
            }
        });
    }
    toModel(row) {
        return {
            candidateId: row.CandidateId,
            fullName: row.FullName,
            skills: row.Skills,
            educationLevel: row.EducationLevel,
            displayEmail: row.DisplayEmail
        };
    }
}
exports.CandidateRepository = CandidateRepository;
//# sourceMappingURL=candidate-repository.js.map