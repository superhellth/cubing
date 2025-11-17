import { Discipline, ISolve, IUser, Status } from "@cubing/shared";
import cors from "cors";
import express, { Request, Response } from 'express';
import process from "node:process";
import { exit, loadEnvFile } from 'node:process';
import { Pool } from "pg";
import { duration } from "zod/v4/classic/iso.cjs";

const app = express();
const port = 3000;

app.use(cors());
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

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get("/db/solves/get", async (req: Request, res: Response) => {
    try {
        const uuid: string = req.query.uuid as string;
        const discipline: Discipline = req.query.discipline as Discipline;
        if (!uuid) {
            console.log('No user data found in query parameters.');
            return res.status(400).json({ error: 'User data is required in query parameters.' });
        }

        const queryText = `SELECT id, scramble, uuid, date, duration, discipline, status
                FROM solves
                WHERE uuid = $1 AND discipline = $2
                ORDER BY date DESC`;
        const queryValues = [uuid, discipline];

        const result = await pool.query(queryText, queryValues);
        res.status(201).json(result.rows);
    } catch (error: any) {
        console.error('Error loading solves:', error.message);
        res.status(500).json({ message: 'Failed to load solves.' });
    }
});

app.post("/db/solves/updateStatus", async (req: Request, res: Response) => {
    try {
        const solve: ISolve = req.body.solve as ISolve;
        const queryText: string = "UPDATE solves SET status = $1 WHERE id = $2 AND uuid = $3 AND discipline = $4 AND session = $5 RETURNING *";
        const queryValues = [solve.status, solve.id, solve.uuid, solve.discipline, solve.session];
        const result = await pool.query(queryText, queryValues);

        res.status(201).json(result.rows[0])
    } catch (error: any) {
        console.error('Error setting solve status:', error.message);
        res.status(500).json({ message: 'Failed to update solve.' });
    }
});


app.post("/db/solves/insert", async (req: Request, res: Response) => {
    try {
        const solve: ISolve = req.body.solve as ISolve;

        const queryText: string = "INSERT INTO solves(uuid, date, duration, scramble, discipline, status, session) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *";
        const queryValues = [solve.uuid, solve.date, solve.duration, solve.scramble, solve.discipline, solve.status, solve.session];

        const result = await pool.query(queryText, queryValues);

        res.status(201).json(result.rows[0]);
    } catch (error: any) {
        console.error('Error inserting solve:', error.message);
        res.status(500).json({ message: 'Failed to insert solve.' });
    }
});

app.post("/db/solves/delete", async (req: Request, res: Response) => {
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

app.post('/db/users/create', async (req: Request, res: Response) => {
    try {
        const user: IUser = req.body.user as IUser;

        const queryText = 'INSERT INTO users(username, created_at) VALUES($1, $2) RETURNING *';
        const queryValues = [user.username, user.createdAt];

        const result = await pool.query(queryText, queryValues);

        res.status(201).json(result.rows[0]);
    } catch (error: any) {
        console.error('Error creating user:', error.message);
        res.status(500).json({ message: 'Failed to create user.' });
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});