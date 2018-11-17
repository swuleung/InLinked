import { UserManager, EnterpriseManager, CandidateManager, ExperienceManager, JobManager } from '../../managers';
import { UserRepository, CandidateRepository, EnterpriseRepository, ExperienceRepository, JobRepository } from '../../repositories';
import { IAuth, JWTAuth } from '../lib/auth';
import { MySql } from '../lib/database';
import { BCryptHash, IHash } from '../lib/hash';

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
        experience: ExperienceManager;
        job: JobManager;
    };
    repositories: {
        user: UserRepository;
        candidate: CandidateRepository,
        enterprise: EnterpriseRepository,
        experience: ExperienceRepository
        job: JobRepository
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
    const experienceRepo = new ExperienceRepository(db);
    const jobRepo = new JobRepository(db);

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
            enterprise: new EnterpriseManager(enterpriseRepo, auth, hash),
            experience: new ExperienceManager(experienceRepo),
            job: new JobManager(jobRepo)
        },
        repositories: {
            user: userRepo,
            candidate: candidateRepo,
            enterprise: enterpriseRepo,
            experience: experienceRepo,
            job: jobRepo
        }
    }
}
