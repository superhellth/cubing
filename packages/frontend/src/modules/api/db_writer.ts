import axios from "axios";
import { IUser } from "@cubing/shared";

class DBWriter {
    private static readonly BASE_URL = 'http://localhost:3000';
    private static readonly CREATE_USER_URL = "/db/users/create";
    private static readonly INSERT_SOLVE_URL = "/db/solves/insert";

    constructor() {
    }

    public async createUser(user: IUser) {
        try {
            // axios handles stringifying the object and setting headers
            const response = await axios.post(DBWriter.BASE_URL + DBWriter.CREATE_USER_URL, {
                user: user
            });

            // axios throws errors on 4xx/5xx, so no need to check `response.ok`
            console.log('User created:', response.data);
            return response.data; // The data is in `response.data`

        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    public async insertSolve(username: string, creationDate: Date) {
        try {
            // axios handles stringifying the object and setting headers
            const response = await axios.post(DBWriter.BASE_URL + DBWriter.INSERT_SOLVE_URL, {
                username: username,
                creationDate: creationDate,
            });

            // axios throws errors on 4xx/5xx, so no need to check `response.ok`
            console.log('User created:', response.data);
            return response.data; // The data is in `response.data`

        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }
}

export default DBWriter;