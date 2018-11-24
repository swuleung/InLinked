export interface Enterprise {
    enterpriseId: number;
    enterpriseName: string;
    enterpriseDescription: string;
    ceo?: string;
    headquarters?: string;
    industry?: string;
}

export interface EnterpriseEx {
    username: string;
    headline?: string;
    password: string;
    email: string;
    profilePicture?: string;
    coverPhoto?: string;
    role: string;
    acctype: string;
    createDate: string;
    lastActiveDate: string;
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