/**
 * Store the token decoded information for the user currently logged in
 */
export interface AuthUser {
    email: string;
    exp: number;
    iat: number;
    id: number;
    role: string;
    username: string;
}
