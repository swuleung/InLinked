/**
 * Candidate model for InLinked
 */
export interface Candidate {
    userId: number;
    candidateId: number;
    username: string;
    headline?: string;
    email: string;
    profilePicture?: string;
    coverPhoto?: string;
    role: string;
    acctype: string;
    fullName: string;
    skills: string;
    displayEmail: number;
}

export function isCandidate(obj: any): boolean {
    return obj.candidateId !== undefined;
}