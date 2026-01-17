
import { StatlessSolvesArraySchema, StatlessSolveSchema, type NewSolve, type Solve, type StatlessSolve } from "@cubing/shared";
import axios from "axios";

class DBWriter {
    private static readonly INSERT_SOLVE_URL = "/api/db/solves/insert";
    private static readonly INSERT_SOLVES_BULK_URL = "/api/db/solves/insertBulk";
    private static readonly DELETE_SOLVE_URL = "/api/db/solves/delete";
    private static readonly UPDATE_SOLVE_URL = "/api/db/solves/updateStatus";
    static #instance: DBWriter;

    private constructor() {
    }

    public static get instance(): DBWriter {
        if (!DBWriter.#instance) {
            DBWriter.#instance = new DBWriter();
        }

        return DBWriter.#instance;
    }

    public async updateSolveStatus(solve: Solve): Promise<StatlessSolve> {
        try {
            const response = await axios.post(DBWriter.UPDATE_SOLVE_URL, {
                pk: solve.pk,
                uuid: solve.uuid,
                status: solve.status
            })
            const updatedSolve: StatlessSolve = StatlessSolveSchema.parse(response.data);
            return updatedSolve;
        } catch (error) {
            console.error("Error updating solve status:", error);
            throw error;
        }
    }

    public async insertSolve(solve: NewSolve): Promise<StatlessSolve> {
        try {
            const response = await axios.post(DBWriter.INSERT_SOLVE_URL, {
                solve: solve
            });

            const fullSolve: StatlessSolve = StatlessSolveSchema.parse(response.data);
            return fullSolve;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 403) {
                    console.warn('User limit reached:', error.response.data.message);
                    throw new Error('LIMIT_REACHED');
                }
            }
            console.error('Error inserting solve:', error);
            throw error;
        }
    }

    public async insertSolvesBulk(solves: NewSolve[]): Promise<StatlessSolve[]> {
        try {
            const response = await axios.post(DBWriter.INSERT_SOLVES_BULK_URL, {
                solves: solves
            });

            const fullSolves: StatlessSolve[] = StatlessSolvesArraySchema.parse(response.data);
            return fullSolves;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 403) {
                    console.warn('User limit reached:', error.response.data.message);
                    throw new Error('LIMIT_REACHED');
                }
            }
            console.error('Error inserting solve:', error);
            throw error;
        }
    }

    public async deleteSolve(pk: bigint, uuid: string) {
        try {
            const response = await axios.post(DBWriter.DELETE_SOLVE_URL, {
                pk: pk.toString(),
                uuid: uuid
            });

            return response.data;
        } catch (error: any) {
            console.error("Error deleting solve:", error);
            throw error;
        }
    }
}

export default DBWriter;