export interface Employee {
    employeeId: number;
    role: string;
    dateJoined: string;
    supervisorId?: number;
}