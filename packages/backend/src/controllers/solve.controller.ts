import { Discipline, ImportSource, NewSolve, NewSolveSchema, NewSolvesArraySchema, Status } from "@cubing/shared";
import format from 'pg-format';
import { Request, Response } from 'express';
import { z } from "zod";
import { pool } from '../config/db';

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

export const getSolvesByDisciplineAndSession = async (req: Request, res: Response) => {
    try {
        const { uuid, discipline, session } = GetByDisciplineQS.parse(req.query);

        const queryText = `
            SELECT id, scramble, uuid, date, duration, discipline, status, session, pk, import_source as "importSource", import_key as "importKey"
            FROM solves
            WHERE uuid = $1 AND discipline = $2 AND session = $3
            ORDER BY date ASC`;

            const result = await pool.query(queryText, [uuid, discipline, session]);
        res.status(200).json(result.rows);
    } catch (error: any) {
        console.error('Error fetching solves:', error);
        res.status(500).json({ message: 'Failed to load solves.' });
    }
};

export const getSolvesByImportSource = async (req: Request, res: Response) => {
    try {
        const { uuid, importSource } = GetByImportSourceQS.parse(req.query);

        const queryText = `
            SELECT id, scramble, uuid, date, duration, discipline, status, session, pk, import_source as "importSource", import_key as "importKey"
            FROM solves
            WHERE uuid = $1 AND import_source = $2
            ORDER BY date ASC`;

        const result = await pool.query(queryText, [uuid, importSource]);
        res.status(200).json(result.rows);
    } catch (error: any) {
        console.error('Error fetching solves:', error);
        res.status(500).json({ message: 'Failed to load solves.' });
    }
};

export const getDemoSolves = async (req: Request, res: Response) => {
    try {
        // Oldest first, newest last
        const queryText = `
            SELECT id, scramble, uuid, date, duration, discipline, status, session, pk, import_source as "importSource", import_key as "importKey"
            FROM solves WHERE uuid = $1 AND discipline = $2 AND session = $3
            ORDER BY date ASC`;

        const result = await pool.query(queryText, ["f67f21f6-b23e-4424-9174-95b56f47a2d5", Discipline.OneHanded, "default"]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching solves:', error);
        res.status(500).json({ message: 'Failed to load solves.' });
    }
};

export const getAllSolves = async (req: Request, res: Response) => {
    try {
        const { uuid } = GetAllSolvesQS.parse(req.query);

        // Oldest first, newest last
        const queryText = `
            SELECT id, scramble, uuid, date, duration, discipline, status, session, pk, import_source as "importSource", import_key as "importKey"
            FROM solves WHERE uuid = $1 ORDER BY date ASC`;

        const result = await pool.query(queryText, [uuid]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching solves:', error);
        res.status(500).json({ message: 'Failed to load solves.' });
    }
};

export const insertSolve = async (req: Request, res: Response) => {
    try {
        const solve: NewSolve = NewSolveSchema.parse(req.body.solve);

        const queryText = `
            INSERT INTO solves(uuid, date, duration, scramble, discipline, status, session, import_source, import_key) 
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) 
            RETURNING *`;

        const values = [solve.uuid, solve.date, solve.duration, solve.scramble, solve.discipline, solve.status, solve.session, solve.importSource, solve.importKey];
        const result = await pool.query(queryText, values);

        res.status(201).json(result.rows[0]);
    } catch (error: any) {
        if (error.code === '23505' && error.message.includes('User limit')) {
            res.status(403).json({ message: 'Limit reached.' });
            return;
        }
        console.error('Error inserting solve:', error);
        res.status(500).json({ message: 'Failed to insert solve.' });
    }
};

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

export const deleteSolve = async (req: Request, res: Response) => {
    try {
        const solvePk = BigInt(req.body.pk);
        const uuid = String(req.body.uuid);
        if (solvePk == null) throw new Error("Invalid Pk");

        const result = await pool.query("DELETE FROM solves WHERE pk = $1 AND uuid = $2 RETURNING pk", [solvePk, uuid]);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error deleting solve:', error);
        res.status(500).json({ message: 'Failed to delete solve.' });
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