import { User } from '../../../models';

/**
 * Used for sanatizing models for response
 */
export function sanitizeUser(user: User): any {
    return {
        username: user.username,
        headline: user.headline,
        email: user.email,
        profilePicture: user.profilePicture,
        coverPhoto: user.coverPhoto,
        acctype: user.acctype
    };
}
