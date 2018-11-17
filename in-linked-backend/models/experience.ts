/**
 * Interface for listing work experience for each candidate
 *
 * @export
 * @interface Experience
 */
export interface Experience {
    experienceId: number;
    userId: number;
    enterpriseId?: number;
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