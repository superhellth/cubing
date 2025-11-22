import axios from "axios";
import type { INewSolve, ISolve } from "@cubing/shared";

class DBWriter {
    private static readonly BASE_URL = 'http://localhost:3000';
    private static readonly INSERT_SOLVE_URL = "/db/solves/insert";
    private static readonly DELETE_SOLVE_URL = "/db/solves/delete";
    private static readonly UPDATE_SOLVE_URL = "/db/solves/updateStatus";

    constructor() {
    }

    public async updateSolveStatus(solve: ISolve) {
        try {
            const response = await axios.post(DBWriter.BASE_URL + DBWriter.UPDATE_SOLVE_URL, {
                solve: solve
            })
            // console.log("Solve status updated:", response.data);
            const updatedSolve: ISolve = response.data as ISolve;
            return updatedSolve;
        } catch (error) {
            console.error("Error updating solve status:", error);
            throw error;
        }
    }

    public async insertSolve(solve: INewSolve): Promise<ISolve> {
        try {
            const response = await axios.post(DBWriter.BASE_URL + DBWriter.INSERT_SOLVE_URL, {
                solve: solve
            });

            // console.log('Solve inserted:', response.data);
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

    public async deleteSolve(solveID: number) {
        try {
            const response = await axios.post(DBWriter.BASE_URL + DBWriter.DELETE_SOLVE_URL, {
                solveID: solveID
            });

            // console.log('Solve deleted:', response.data);
            return response.data;
        } catch (error: any) {
            console.error("Error deleting solve:", error);
            throw error;
        }
    }
}

export default DBWriter;