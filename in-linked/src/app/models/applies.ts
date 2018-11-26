export interface Applies {
    jobId: number;
    candidateId: number;
    dateApplied: Date;
}

export function isApplies(obj: any): boolean {
    return obj.jobId !== undefined && obj.candidateId !== undefined;
}