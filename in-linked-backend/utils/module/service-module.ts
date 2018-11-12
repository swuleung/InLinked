import { UserManager, EnterpriseManager, CandidateManager } from '../../managers';
import { UserRepository } from '../../repositories';
import { IAuth, JWTAuth } from '../lib/auth';
import { MySql } from '../lib/database';
import { BCryptHash, IHash } from '../lib/hash';
import { CandidateRepository } from '../../repositories/candidate-repository';
import { EnterpriseRepository } from '../../repositories/enterprise-repository';

/**
 * A global instance that holds access to important components such as libs, managers, and repositories
 */
export interface ServiceModule {
    libs: {
        auth: IAuth;
        hash: IHash;
    };
    managers: {
        user: UserManager;
        candidate: CandidateManager;
        enterprise: EnterpriseManager;
    };
    repositories: {
        user: UserRepository;
    };
}

/**
 * Builds a module containing all the libs, managers, and services for the app
 * 
 * @export
 * @param {MySql} db - the database conenctor
 * @returns {ServiceModule} - a module containing services
 */
export function buildModule(db: MySql): ServiceModule {

    const userRepo = new UserRepository(db);
    const candidateRepo = new CandidateRepository(db);
    const enterpriseRepo = new EnterpriseRepository(db);

    const auth = new JWTAuth(userRepo);
    const hash = new BCryptHash();

    return {
        libs: {
            auth,
            hash,
        },
        managers: {
            user: new UserManager(userRepo, auth, hash),
            candidate: new CandidateManager(candidateRepo, auth, hash),
            enterprise: new EnterpriseManager(enterpriseRepo, auth, hash)
        },
        repositories: {
            user: userRepo
        }
    }
}
