export interface Enterprise {
    enterpriseId: number;
    enterpriseName: string;
    enterpriseDescription: string;
    ceo?: string;
    headquarters?: string;
    industry?: string;
}

export interface EnterpriseExt {
    userId: number;
    username: string;
    headline?: string;
    email: string;
    profilePicture?: string;
    coverPhoto?: string;
    role: string;
    acctype: string;
    enterpriseId: number;
    enterpriseName: string;
    enterpriseDescription: string;
    ceo?: string;
    headquarters?: string;
    industry?: string;
}

export function isEnterprise(obj: any): boolean {
    return obj.enterpriseId !== undefined;
}