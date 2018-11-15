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
class EnterpriseRepository {
    constructor(db) {
        this.TABLE_NAME = 'enterprise';
        this.db = db;
    }
    insert(enterprise) {
        return __awaiter(this, void 0, void 0, function* () {
            const conn = yield this.db.getConnection();
            try {
                const res = yield conn.table(this.TABLE_NAME).insert({
                    EnterpriseId: enterprise.enterpriseId,
                    EnterpriseName: enterprise.enterpriseName,
                    EnterpriseDescription: enterprise.enterpriseDescription,
                    CEO: enterprise.ceo,
                    HeadQuarters: enterprise.headquarters,
                    Industry: enterprise.industry
                });
                return enterprise;
            }
            catch (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    throw new exceptions_1.ValidationException(`The enterprise ${enterprise.enterpriseName} already exists.`, err);
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
                .where({ EnterpriseId: id })
                .first();
            if (!row) {
                throw new exceptions_1.NotFoundException(`The id '${id}' does not exist in the enterprise table.`);
            }
            return this.toModel(row);
        });
    }
    update(enterprise) {
        return __awaiter(this, void 0, void 0, function* () {
            const conn = yield this.db.getConnection();
            yield conn.table(this.TABLE_NAME)
                .where({ EnterpriseId: enterprise.enterpriseId })
                .update({
                EnterpriseName: enterprise.enterpriseName,
                EnterpriseDescription: enterprise.enterpriseDescription,
                CEO: enterprise.ceo,
                HeadQuarters: enterprise.headquarters,
                Industry: enterprise.industry
            });
            return enterprise;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.db.getTransaction();
            try {
                yield transaction.from(this.TABLE_NAME)
                    .delete()
                    .where({ EnterpriseId: id });
                yield transaction.commit();
            }
            catch (err) {
                transaction.rollback(err);
                throw err;
            }
        });
    }
    toModel(row) {
        return {
            enterpriseId: row.EnterpriseId,
            enterpriseName: row.EnterpriseName,
            enterpriseDescription: row.EnterpriseDescription,
            ceo: row.CEO,
            headquarters: row.Headquarters,
            industry: row.Industry
        };
    }
}
exports.EnterpriseRepository = EnterpriseRepository;
//# sourceMappingURL=enterprise-repository.js.map