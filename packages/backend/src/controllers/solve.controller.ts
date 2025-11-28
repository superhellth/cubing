import { Request, Response } from 'express';
import { pool } from '../config/db';
import { Discipline, SolveSchema, NewSolveSchema, INewSolve, ISolve } from "@cubing/shared";
import { z } from "zod";

const GetAllSolvesQS = z.object({ uuid: z.uuid() });
const GetByDisciplineQS = z.object({
    uuid: z.uuid(),
    discipline: z.enum(Discipline),
    session: z.string()
});

export const GetSolvesByDisciplineAndSession = async (req: Request, res: Response) => {
    try {
        const { uuid, discipline, session } = GetByDisciplineQS.parse(req.query);

        const queryText = `
            SELECT id, scramble, uuid, date, duration, discipline, status, session, pk
            FROM solves
            WHERE uuid = $1 AND discipline = $2 AND session = $3
            ORDER BY date DESC`;

        const result = await pool.query(queryText, [uuid, discipline, session]);
        res.status(200).json(result.rows);
    } catch (error: any) {
        console.error('Error fetching solves:', error);
        res.status(500).json({ message: 'Failed to load solves.' });
    }
};

export const getAllSolves = async (req: Request, res: Response) => {
    try {
        const { uuid } = GetAllSolvesQS.parse(req.query);

        const queryText = `
            SELECT id, scramble, uuid, date, duration, discipline, status, session, pk
            FROM solves WHERE uuid = $1 ORDER BY date DESC`;

        const result = await pool.query(queryText, [uuid]);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Failed to load solves.' });
    }
};

export const insertSolve = async (req: Request, res: Response) => {
    try {
        const solve: INewSolve = NewSolveSchema.parse(req.body.solve);

        const queryText = `
            INSERT INTO solves(uuid, date, duration, scramble, discipline, status, session) 
            VALUES($1, $2, $3, $4, $5, $6, $7) 
            RETURNING *`;

        const values = [solve.uuid, solve.date, solve.duration, solve.scramble, solve.discipline, solve.status, solve.session];
        const result = await pool.query(queryText, values);

        res.status(201).json(result.rows[0]);
    } catch (error: any) {
        if (error.code === '23505' && error.message.includes('User limit')) {
            res.status(403).json({ message: 'Limit reached.' });
            return;
        }
        console.error(error);
        res.status(500).json({ message: 'Failed to insert solve.' });
    }
};

export const updateSolveStatus = async (req: Request, res: Response) => {
    try {
        const solve: ISolve = SolveSchema.parse(req.body.solve);

        const queryText = `
            UPDATE solves SET status = $1 
            WHERE pk = $2
            RETURNING *`;

        const result = await pool.query(queryText, [solve.status, solve.pk]);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update solve.' });
    }
};

export const deleteSolve = async (req: Request, res: Response) => {
    try {
        const solvePk = BigInt(req.body.pk);
        if (solvePk == null) throw new Error("Invalid Pk");

        const result = await pool.query("DELETE FROM solves WHERE pk = $1 RETURNING pk", [solvePk]);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete solve.' });
    }
};