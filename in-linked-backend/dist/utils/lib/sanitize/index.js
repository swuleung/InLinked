"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Used for sanatizing models for response
 */
function sanitizeUser(user) {
    return {
        username: user.username,
        headline: user.headline,
        email: user.email,
        profilePicture: user.profilePicture,
        coverPhoto: user.coverPhoto,
    };
}
exports.sanitizeUser = sanitizeUser;
//# sourceMappingURL=index.js.map