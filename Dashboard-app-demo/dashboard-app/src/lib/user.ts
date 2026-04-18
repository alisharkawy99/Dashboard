import { hashSync } from "bcryptjs";
export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
};
const adminUser: User = {
    id: crypto.randomUUID(),
    name: "ali",
    email: "ali@example.com",
    passwordHash: hashSync("12345678", 10),
}

const users = new Map<string, User>();
users.set(adminUser.email.toLowerCase(), adminUser);
export function findUserByEmail(email: string) {
    return users.get(email.toLowerCase()) ?? null;
  }
  
  export function createUser(user: User) {
    users.set(user.email.toLowerCase(), user);
    return user;
  }