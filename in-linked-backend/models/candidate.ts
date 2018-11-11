export interface Candidate {
    candidateId: number;
    fullName: string;
    skills?: string;
    experience?: string;
    educationLevel?: string;
}

export function isCandidate(obj: any): boolean {
    return obj.type === 'Candidate';
}