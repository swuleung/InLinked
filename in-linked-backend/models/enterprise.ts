export interface Enterprise {
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