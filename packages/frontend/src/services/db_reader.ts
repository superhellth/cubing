import { SolveSchema, type Discipline, type ISolve } from "@cubing/shared";
import axios from "axios";
import z from "zod";

class DBReader {

    private static readonly GET_ALL_SOLVES_URL = "/api/db/solves/getAll";
    private static readonly GET_SOLVES_BY_DISCIPLINE = "/api/db/solves/getByDiscipline";
    private static readonly CHECK_HEALTH_URL = "/api/health";
    static #instance: DBReader;

    private constructor() {
    }

    public static get instance(): DBReader {
        if (!DBReader.#instance) {
            DBReader.#instance = new DBReader();
        }

        return DBReader.#instance;
    }

    public async getAllUserSolves(uuid: string) {
        try {
            const SolvesArraySchema = z.array(SolveSchema);
            const response = await axios.get(DBReader.GET_ALL_SOLVES_URL, {
                params: {
                    uuid: uuid
                }
            });

            const solves: ISolve[] = SolvesArraySchema.parse(response.data);
            return solves;

        } catch (error) {
            console.error('Error fetching user solves:', error);
            throw error;
        }
    }

    public async getSolvesByDiscipline(uuid: string, discipline: Discipline) {
        try {
            const SolvesArraySchema = z.array(SolveSchema);
            const response = await axios.get(DBReader.GET_SOLVES_BY_DISCIPLINE, {
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

            const response = await fetch(DBReader.CHECK_HEALTH_URL, {
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                return false;
            }

            return true;
        } catch (error) {
            return false;
        }
    };
}

export default DBReader;