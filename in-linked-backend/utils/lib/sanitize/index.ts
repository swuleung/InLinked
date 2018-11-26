import { User } from '../../../models';

/**
 * Used for sanatizing models for response
 */
export function sanitizeUser(user: User): any {
    return {
        userId: user.userId,
        username: user.username,
        headline: user.headline,
        email: user.email,
        profilePicture: user.profilePicture,
        coverPhoto: user.coverPhoto,
        role: user.role,
        acctype: user.acctype
    };
}
