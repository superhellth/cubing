import { SolveSchema, type Discipline, type ISolve } from "@cubing/shared";
import axios from "axios";
import z from "zod";

class DBReader {
    private static readonly BASE_URL = 'http://localhost:3000';
    private static readonly READ_SOLVES_URL = "/db/solves/get";
    private static readonly CHECK_HEALTH_URL = "/health";

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
            console.error('Error fetching user solves:', error);
            throw error;
        }
    }

    public async checkHealth() {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);

            await fetch(DBReader.BASE_URL + DBReader.CHECK_HEALTH_URL, {
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            return true;
        } catch (error) {
            return false;
        }
    };
}

export default DBReader;