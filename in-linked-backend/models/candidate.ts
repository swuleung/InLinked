export interface Candidate {
    candidateId: number;
    fullName: string;
    skills?: string;
    displayEmail?: boolean;
}

/* Includes User fields (for searching) */
export interface CandidateExt {
    userId: number;
    username: string;
    headline?: string;
    email: string;
    profilePicture?: string;
    coverPhoto?: string;
    role: string;
    acctype: string;
    candidateId: number;
    fullName: string;
    skills?: string;
    displayEmail?: boolean;
}

export function isCandidate(obj: any): boolean {
    return obj.candidateId !== undefined;
}