import type { IUser } from "@cubing/shared";

class User implements IUser {
    readonly username: string;
    readonly createdAt: Date;

    constructor(username: string, createdAt: Date) {
        this.username = username;
        this.createdAt = createdAt;
    }
}

export default User;