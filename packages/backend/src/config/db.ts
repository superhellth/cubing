import { Pool } from "pg";
import process, { exit, loadEnvFile } from "node:process";

// types.setTypeParser(types.builtins.INT8, (val) => val.toString());
try {
    loadEnvFile('./.env');
} catch (error) {
    console.log("No .env file found...");
    exit(1);
}


export const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
});