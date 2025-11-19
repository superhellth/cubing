import { SolveSchema, type Discipline, type ISolve } from "@cubing/shared";
import axios from "axios";
import z from "zod";

class DBReader {
    private static readonly BASE_URL = 'http://localhost:3000';
    private static readonly READ_SOLVES_URL = "/db/solves/get";

    constructor() {
    }

    public async getAllUserSolves(uuid: string, discipline: Discipline) {
        try {
            const SolvesArraySchema = z.array(SolveSchema);
            const response = await axios.get(DBReader.BASE_URL + DBReader.READ_SOLVES_URL, {
                params: {
                    uuid: uuid,
                    discipline: discipline,
                }
            });

            const solves: ISolve[] = SolvesArraySchema.parse(response.data);
            return solves;

        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }
}

export default DBReader;