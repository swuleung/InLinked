export interface Applies {
    jobId: number;
    candidateId: number;
    dateApplied: string;
}

export function isApplies(obj: any): boolean {
    return obj.jobId !== undefined && obj.candidateId !== undefined;
}