/**
 * Candidate model for InLinked
 */
export interface Candidate {
    candidateId: number;
    username: string;
    headline?: string;
    email: string;
    profilePicture?: string;
    coverPhoto?: string;
    fullName: string;
    skills: string;
    educationLevel: string;
}
