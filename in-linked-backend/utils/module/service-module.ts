import { UserManager } from '../../managers';
import { UserRepository } from '../../repositories';
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

    const auth = new JWTAuth(userRepo);
    const hash = new BCryptHash();

    return {
        libs: {
            auth,
            hash
        },
        managers: {
            user: new UserManager(userRepo, auth, hash)
        },
        repositories: {
            user: userRepo
        }
    }
}
