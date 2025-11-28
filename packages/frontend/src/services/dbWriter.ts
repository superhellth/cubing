import type { INewSolve, ISolve } from "@cubing/shared";
import axios from "axios";

class DBWriter {
    private static readonly INSERT_SOLVE_URL = "/api/db/solves/insert";
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

    public async updateSolveStatus(solve: ISolve) {
        try {
            const response = await axios.post(DBWriter.UPDATE_SOLVE_URL, {
                solve: solve
            })
            const updatedSolve: ISolve = response.data as ISolve;
            return updatedSolve;
        } catch (error) {
            console.error("Error updating solve status:", error);
            throw error;
        }
    }

    public async insertSolve(solve: INewSolve): Promise<ISolve> {
        try {
            const response = await axios.post(DBWriter.INSERT_SOLVE_URL, {
                solve: solve
            });

            const fullSolve: ISolve = response.data as ISolve;
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

    public async deleteSolve(pk: bigint) {
        try {
            const response = await axios.post(DBWriter.DELETE_SOLVE_URL, {
                pk: pk.toString()
            });

            return response.data;
        } catch (error: any) {
            console.error("Error deleting solve:", error);
            throw error;
        }
    }
}

export default DBWriter;