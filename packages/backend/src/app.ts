import { Discipline, INewSolve, ISolve, NewSolveSchema, SolveSchema } from "@cubing/shared";
import cors from "cors";
import express, { Request, Response } from 'express';
import process from "node:process";
import { exit, loadEnvFile } from 'node:process';
import { Pool } from "pg";
import z from "zod";
import rateLimit from 'express-rate-limit';

const app = express();
const port = 3000;

app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://highpercube.com'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(express.json());

try {
    console.log("Loading environment variables...");
    loadEnvFile('./.env');
    console.log("Successfully loaded environment variables.")
} catch (error) {
    console.log("No .env file found...");
    exit(0);
}

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
});

const updateLimit = rateLimit({
    windowMs: 1000,
    max: 2,
    message: {
        message: "Too many requests."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
})

const GetSolvesQuerySchema = z.object({
    uuid: z.uuid(),
    discipline: z.enum(Discipline)
});

app.get("/db/solves/get", updateLimit, async (req: Request, res: Response) => {
    try {
        const queryParams = GetSolvesQuerySchema.parse(req.query);

        const queryText = `SELECT id, scramble, uuid, date, duration, discipline, status, session
                FROM solves
                WHERE uuid = $1 AND discipline = $2
                ORDER BY date DESC`;
        const queryValues = [queryParams.uuid, queryParams.discipline];

        const result = await pool.query(queryText, queryValues);
        res.status(201).json(result.rows);
    } catch (error: any) {
        console.error('Error loading solves:', error.message);
        res.status(500).json({ message: 'Failed to load solves.' });
    }
});

app.post("/db/solves/updateStatus", updateLimit, async (req: Request, res: Response) => {
    try {
        const solve: ISolve = SolveSchema.parse(req.body.solve);
        const queryText: string = "UPDATE solves SET status = $1 WHERE id = $2 AND uuid = $3 AND discipline = $4 AND session = $5 RETURNING *";
        const queryValues = [solve.status, solve.id, solve.uuid, solve.discipline, solve.session];
        const result = await pool.query(queryText, queryValues);

        res.status(201).json(result.rows[0])
    } catch (error: any) {
        console.error('Error setting solve status:', error.message);
        res.status(500).json({ message: 'Failed to update solve.' });
    }
});


app.post("/db/solves/insert", updateLimit, async (req: Request, res: Response) => {
    try {
        const solve: INewSolve = NewSolveSchema.parse(req.body.solve);

        const queryText: string = "INSERT INTO solves(uuid, date, duration, scramble, discipline, status, session) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *";
        const queryValues = [solve.uuid, solve.date, solve.duration, solve.scramble, solve.discipline, solve.status, solve.session];

        const result = await pool.query(queryText, queryValues);

        res.status(201).json(result.rows[0]);

    } catch (error: any) {
        if (error.code === '23505' && error.message.includes('User limit')) {
            return res.status(403).json({
                message: 'Limit reached. Please delete old solves to add new ones.'
            });
        }
        console.error('Error inserting solve:', error.message);
        res.status(500).json({ message: 'Failed to insert solve.' });
    }
});

app.post("/db/solves/delete", updateLimit, async (req: Request, res: Response) => {
    try {
        const solveID: number = req.body.solveID as number;
        const queryText = "DELETE FROM solves WHERE id = $1";
        const queryValues = [solveID];

        const result = await pool.query(queryText, queryValues);

        res.status(201).json(result.rows[0]);
    } catch (error: any) {
        console.error('Error deleting solve:', error.message);
        res.status(500).json({ message: 'Failed to delete solve.' });
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});