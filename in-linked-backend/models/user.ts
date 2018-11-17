/**
 * User model for InLinked (candidates and managers)
 */
export interface User {
    userId: number;
    username: string;
    headline?: string;
    password: string;
    email: string;
    profilePicture?: string;
    coverPhoto?: string;
    role: string;
    acctype: string;
    createDate: Date;
    lastActiveDate: Date;
}

export function isUser(obj: any): boolean {
    return obj.userId !== undefined;
}