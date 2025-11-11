import { ISolve, IUser } from "@cubing/shared";
import cors from "cors";
import express, { Request, Response } from 'express';
import { exit, loadEnvFile } from 'node:process';
import { Pool } from "pg";

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

app.post('/db/users/create', async (req: Request, res: Response) => {
    try {
        const user: IUser = req.body as IUser;

        const queryText = 'INSERT INTO users(username, created_at) VALUES($1, $2) RETURNING *';
        const queryValues = [user.username, user.createdAt];

        const result = await pool.query(queryText, queryValues);
        console.log(result);

        res.status(201).json(result.rows[0]);
    } catch (error: any) {
        console.error('Error creating user:', error.message);
        res.status(500).json({ message: 'Failed to create user.' });
    }
});

app.post("/db/solves/insert", async (req: Request, res: Response) => {
    try {
        const solve: ISolve = req.body as ISolve;

        const queryText = "INSERT INTO solves(username, date, duration) VALUES($1, $2, $3) RETURNING *";
        const queryValues = [solve.user, solve.date, solve.timeInMs];

        const result = await pool.query(queryText, queryValues);
        console.log(result);

        res.status(201).json(result.rows[0]);
    } catch (error: any) {
        console.error('Error inserting solve:', error.message);
        res.status(500).json({ message: 'Failed to insert solve.' });
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})