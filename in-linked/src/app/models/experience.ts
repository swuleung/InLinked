/**
 * Experience Model for InLinked
 */
export interface Experience {
    experienceId: number;
    candidateId: number;
    enterpriseId?: number; // If the user decides to link an existing company profile
    enterpriseName: string;
    positionName: string;
    description?: string;
    startMonth: number;
    startYear: number;
    endMonth?: number;
    endYear?: number;
    location?: string; 
}

export function isExperience(obj: any): boolean {
    return obj.experienceId !== undefined;
}