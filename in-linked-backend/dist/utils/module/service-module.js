"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const managers_1 = require("../../managers");
const repositories_1 = require("../../repositories");
const auth_1 = require("../lib/auth");
const hash_1 = require("../lib/hash");
/**
 * Builds a module containing all the libs, managers, and services for the app
 *
 * @export
 * @param {MySql} db - the database conenctor
 * @returns {ServiceModule} - a module containing services
 */
function buildModule(db) {
    const userRepo = new repositories_1.UserRepository(db);
    const candidateRepo = new repositories_1.CandidateRepository(db);
    const enterpriseRepo = new repositories_1.EnterpriseRepository(db);
    const experienceRepo = new repositories_1.ExperienceRepository(db);
    const auth = new auth_1.JWTAuth(userRepo);
    const hash = new hash_1.BCryptHash();
    return {
        libs: {
            auth,
            hash,
        },
        managers: {
            user: new managers_1.UserManager(userRepo, auth, hash),
            candidate: new managers_1.CandidateManager(candidateRepo, auth, hash),
            enterprise: new managers_1.EnterpriseManager(enterpriseRepo, auth, hash),
            experience: new managers_1.ExperienceManager(experienceRepo)
        },
        repositories: {
            user: userRepo
        }
    };
}
exports.buildModule = buildModule;
//# sourceMappingURL=service-module.js.map