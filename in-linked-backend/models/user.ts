/**
 * User model for InLinked (candidates and managers)
 */
export interface User {
    id: number;
    username: string;
    headline?: string;
    password: string;
    email: string;
}