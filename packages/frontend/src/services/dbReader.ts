import { ImportSource, StatlessSolvesArraySchema, type Discipline, type StatlessSolve } from "@cubing/shared";
import axios from "axios";

class DBReader {

    private static readonly GET_ALL_SOLVES_URL = "/api/db/solves/getAll";
    private static readonly GET_SOLVES_BY_IMPORT_SOURCE = "/api/db/solves/getByImportSource";
    private static readonly GET_SOLVES_BY_DISCIPLINE_AND_SESSION = "/api/db/solves/getByDisciplineAndSession";
    private static readonly GET_DEMO_SOLVES = "/api/db/solves/getDemoSolves";
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
            const response = await axios.get(DBReader.GET_ALL_SOLVES_URL, {
                params: {
                    uuid: uuid
                }
            });

            const solves: StatlessSolve[] = StatlessSolvesArraySchema.parse(response.data);
            return solves;

        } catch (error) {
            console.error('Error fetching user solves:', error);
            throw error;
        }
    }

    public async getSolvesByImportSource(uuid: string, importSource: ImportSource) {
        try {
            const response = await axios.get(DBReader.GET_SOLVES_BY_IMPORT_SOURCE, {
                params: {
                    uuid: uuid,
                    importSource: importSource,
                }
            });

            const solves: StatlessSolve[] = StatlessSolvesArraySchema.parse(response.data);
            return solves;

        } catch (error) {
            console.error('Error fetching user solves:', error);
            throw error;
        }
    }

    public async getSolvesByDisciplineAndSession(uuid: string, discipline: Discipline, session: string) {
        try {
            const response = await axios.get(DBReader.GET_SOLVES_BY_DISCIPLINE_AND_SESSION, {
                params: {
                    uuid: uuid,
                    discipline: discipline,
                    session: session
                }
            });

            const solves: StatlessSolve[] = StatlessSolvesArraySchema.parse(response.data);
            return solves;

        } catch (error) {
            console.error('Error fetching user solves:', error);
            throw error;
        }
    }

    public async getDemoSolves() {
        try {
            const response = await axios.get(DBReader.GET_DEMO_SOLVES);

            const solves: StatlessSolve[] = StatlessSolvesArraySchema.parse(response.data);
            return solves;

        } catch (error) {
            console.error('Error fetching demo solves:', error);
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