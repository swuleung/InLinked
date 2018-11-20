import { Candidate } from './candidate';
import { Enterprise } from './enterprise';

export interface User {
  userId: number;
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
  special: Candidate | Enterprise;
}

export function isUser(obj: any): boolean {
  return obj.userId !== undefined;
}
