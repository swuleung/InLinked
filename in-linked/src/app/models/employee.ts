/**
 * Employee model for InLinked
 */
export interface Employee {
    employeeId: number;
    role: string;
    dateJoined: string;
}

export function isEmployee(obj: any): boolean {
    return obj.employeeId !== undefined;
}