/**
 * Enterprise model for InLinked
 */
export interface Enterprise {
    enterpriseId: number;
    enterpriseName: string;
    enterpriseDescription: string;
    ceo?: string;
    headquarters?: string;
    industry?: string;
    email: string;
    profilePicture?: string;
    coverPhoto?: string;
}

export function isEnterprise(obj: any): boolean {
    return obj.enterpriseId !== undefined;
}