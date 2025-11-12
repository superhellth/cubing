import axios from "axios";
import type { ISolve, IUser } from "@cubing/shared";

class DBReader {
    private static readonly BASE_URL = 'http://localhost:3000';
    private static readonly READ_SOLVES_URL = "/db/solves/get";

    constructor() {
    }

    public async getAllUserSolves(user: IUser) {
        try {
            // axios handles stringifying the object and setting headers
            const response = await axios.get(DBReader.BASE_URL + DBReader.READ_SOLVES_URL, {
                params: {
                    username: user.username
                }
            });

            console.log('Fetched solves');
            const solves: ISolve[] = response.data as ISolve[];
            return solves;

        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }
}

export default DBReader;