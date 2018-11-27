/**
 * Job model for InLinked
 */
export interface Job {
    jobId: number;
    enterpriseId: number;
    jobTitle: string;
    jobDescription: string;
    salary?: string;
    employmentType?: string;
    experienceLevel?: string;
    educationLevel?: string;
    city?: string;
    province?: string;
    country?: string;
    postedDate: Date;
}

export function isJob(obj: any): boolean {
    return obj.jobId !== undefined;
}