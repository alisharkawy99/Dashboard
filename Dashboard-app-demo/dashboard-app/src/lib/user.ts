import { hashSync } from "bcryptjs";
export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
};
const users = new Map<string, User>();
export function findUserByEmail(email: string) {
    return users.get(email.toLowerCase()) ?? null;
  }
  
  export function createUser(user: User) {
    users.set(user.email.toLowerCase(), user);
    return user;
  }