import { UserManager, EnterpriseManager, CandidateManager, ExperienceManager, JobManager, EducationManager } from '../../managers';
import { UserRepository, CandidateRepository, EnterpriseRepository, ExperienceRepository, JobRepository, EducationRepository } from '../../repositories';
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
        education: EducationManager;
    };
    repositories: {
        user: UserRepository;
        candidate: CandidateRepository,
        enterprise: EnterpriseRepository,
        experience: ExperienceRepository
        job: JobRepository,
        education: EducationRepository
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
    const educationRepo = new EducationRepository(db);

    const auth = new JWTAuth(userRepo);
    const hash = new BCryptHash();

    return {
        libs: {
            auth,
            hash,
        },
        managers: {
            user: new UserManager(userRepo, auth, hash),
            candidate: new CandidateManager(candidateRepo),
            enterprise: new EnterpriseManager(enterpriseRepo),
            experience: new ExperienceManager(experienceRepo, userRepo),
            job: new JobManager(jobRepo, userRepo),
            education: new EducationManager(educationRepo, userRepo)
        },
        repositories: {
            user: userRepo,
            candidate: candidateRepo,
            enterprise: enterpriseRepo,
            experience: experienceRepo,
            job: jobRepo,
            education: educationRepo
        }
    }
}
