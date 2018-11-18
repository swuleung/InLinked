export interface Education {
    educationId: number;
    candidateId: number;
    schoolName: string;
    startMonth: number;
    startYear: number;
    endMonth?: number;
    endYear?: number;
    location: string;
    degree?: string;
}

export function isEducation(obj: any): boolean {
    return obj.educationId !== undefined;
}