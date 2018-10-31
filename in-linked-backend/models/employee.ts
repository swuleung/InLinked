export interface Employee {
    employeeId: number;
    role: string;
    dateJoined: Date;
    supervisorId?: number;
}