/**
 * Enterprise model for InLinked
 */
export interface Enterprise {
    enterpriseId: number;
    enterpriseName: string;
    enterpriseDescription: string;
    ceo?: string;
    headquarters?: string;
    industry?: string;
    email: string;
    profilePicture?: string;
    coverPhoto?: string;
}
