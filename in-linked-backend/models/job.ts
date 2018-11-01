export interface Job {
    jobId: number;
    enterpriseId: number;
    jobTitle: string;
    jobDescription: string;
    salary?: number;
    employmentType?: string;
    experienceLevel?: string;
    educationLevel?: string;
    city?: string;
    province?: string;
    country?: string;
}