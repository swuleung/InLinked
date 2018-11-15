export interface Candidate {
    candidateId: number;
    fullName: string;
    skills?: string;
    educationLevel?: string;
    displayEmail?: boolean;
}

export function isCandidate(obj: any): boolean {
    return obj.candidateId !== undefined;
}