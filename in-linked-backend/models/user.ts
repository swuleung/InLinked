/**
 * User model for InLinked (candidates and managers)
 */
export interface User {
    userId: number;
    username: string;
    role: string;
    headline?: string;
    password: string;
    email: string;
    profilePicture?: string;
    coverPhoto?: string;
    acctype: string;
}