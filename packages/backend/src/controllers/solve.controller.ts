import { Discipline, ImportSource, NewSolve, NewSolveSchema, NewSolvesArraySchema, Status } from "@cubing/shared";
import format from 'pg-format';
import { NextFunction, Request, Response } from 'express';
import { z } from "zod";
import { pool } from '../config/db';

const SOLVE_COLUMNS = `
    id, scramble, uuid, date, duration, discipline, status, session, pk, 
    import_source as "importSource", 
    import_key as "importKey"
`;

const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch((error) => {
        console.error('Controller Error:', error);
        // Handle specific DB errors (like duplicate keys) centrally if needed
        if (error.code === '23505' && error.message.includes('User limit')) {
            return res.status(403).json({ message: 'Limit reached.' });
        }
        res.status(500).json({ message: 'Request failed.' });
    });
};

const fetchSolves = async (whereClause: string, params: any[]) => {
    const queryText = `
        SELECT ${SOLVE_COLUMNS}
        FROM solves
        WHERE ${whereClause}
        ORDER BY date ASC
    `;
    const result = await pool.query(queryText, params);
    return result.rows;
};

const GetAllSolvesQS = z.object({ uuid: z.uuid() });
const GetByDisciplineQS = z.object({
    uuid: z.uuid(),
    discipline: z.enum(Discipline),
    session: z.string()
});
const GetByImportSourceQS = z.object({
    uuid: z.uuid(),
    importSource: z.enum(ImportSource).nullable()
});

export const getSolvesByDisciplineAndSession = asyncHandler(async (req: Request, res: Response) => {
    const { uuid, discipline, session } = GetByDisciplineQS.parse(req.query);
    const rows = await fetchSolves('uuid = $1 AND discipline = $2 AND session = $3', [uuid, discipline, session]);
    res.status(200).json(rows);
});

export const getSolvesByImportSource = asyncHandler(async (req: Request, res: Response) => {
    const { uuid, importSource } = GetByImportSourceQS.parse(req.query);
    const rows = await fetchSolves('uuid = $1 AND import_source = $2', [uuid, importSource]);
    res.status(200).json(rows);
});

export const getDemoSolves = asyncHandler(async (req: Request, res: Response) => {
    const rows = await fetchSolves('uuid = $1 AND discipline = $2 AND session = $3', [
        "f67f21f6-b23e-4424-9174-95b56f47a2d5",
        Discipline.OneHanded,
        "default"
    ]);
    res.status(200).json(rows);
});

export const getAllSolves = asyncHandler(async (req: Request, res: Response) => {
    const { uuid } = GetAllSolvesQS.parse(req.query);
    const rows = await fetchSolves('uuid = $1', [uuid]);
    res.status(200).json(rows);
});

export const insertSolvesBulk = async (req: Request, res: Response) => {
    try {
        const solves: NewSolve[] = NewSolvesArraySchema.parse(req.body.solves);
        if (solves.length === 0) return res.json([]);
        const rows = solves.map(s => [s.uuid, s.date, s.duration, s.scramble, s.discipline, s.status, s.session, s.importSource, s.importKey]);

        const queryText = format(
            'INSERT INTO solves (uuid, date, duration, scramble, discipline, status, session, import_source, import_key) VALUES %L RETURNING *',
            rows
        );
        const result = await pool.query(queryText);

        res.status(201).json(result.rows);
    } catch (error: any) {
        if (error.code === '23505' && error.message.includes('User limit')) {
            res.status(403).json({ message: 'Limit reached.' });
            return;
        }
        console.error('Error inserting solve:', error);
        res.status(500).json({ message: 'Failed to insert solve.' });
    }
};

export const updateSolveStatus = async (req: Request, res: Response) => {
    try {
        const solvePk = BigInt(req.body.pk);
        const uuid = String(req.body.uuid);
        const status = req.body.status as Status;

        const queryText = `
            UPDATE solves SET status = $1 
            WHERE pk = $2 AND uuid = $3
            RETURNING *`;

        const result = await pool.query(queryText, [status, solvePk, uuid]);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error updating solve status:', error);
        res.status(500).json({ message: 'Failed to update solve.' });
    }
};

export const deleteSolvesBulk = async (req: Request, res: Response) => {
    try {
        const solvePks = req.body.pks.map((pk: any) => BigInt(pk));
        const uuid = String(req.body.uuid);
        if (solvePks.length == 0) throw new Error("Empty Array");

        const result = await pool.query("DELETE FROM solves WHERE pk = ANY($1) AND uuid = $2 RETURNING pk", [solvePks, uuid]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error deleting solve:', error);
        res.status(500).json({ message: 'Failed to delete solve.' });
    }
};