import * as fs from 'fs';
import * as readline from 'readline';
import { Pool } from 'pg';
import { exit, loadEnvFile } from 'process';
import pkg, { ISolve } from '@cubing/shared';

// Destructure the specific named exports you need from it
const { Discipline, Status } = pkg;

// --- CONFIGURATION ---
const FILE_PATH = 'solves.txt'; // Path to your text file

// Database Configuration
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

// The data typically not found in the text file, but required for the DB
const INSERT_CONSTANTS = {
    uuid: 'f67f21f6-b23e-4424-9174-95b56f47a2d5',
    discipline: Discipline.OneHanded,
    session: "default",
    status: Status.Valid
};


// --- MAIN LOGIC ---
async function processLineByLine() {
    console.log('Starting import process...');

    const fileStream = fs.createReadStream(FILE_PATH);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });

    let successCount = 0;
    let errorCount = 0;

    // Iterate through the file line by line
    for await (const line of rl) {
        if (!line.trim()) continue;

        try {
            const parsedData = parseLine(line, successCount);
            if (parsedData) {
                await insertIntoDatabase(parsedData);
                successCount++;
            }
        } catch (err) {
            console.error(`Failed to process line: ${line}`, err);
            errorCount++;
        }
    }

    console.log('------------------------------------------------');
    console.log(`Import finished.`);
    console.log(`Successfully inserted: ${successCount}`);
    console.log(`Errors: ${errorCount}`);

    // Close database connection
    await pool.end();
}

function convertToMs(timeStr: string): number {
    // 1. Split by colon to check if minutes exist
    const parts = timeStr.split(':');
    
    let totalSeconds = 0;

    if (parts.length === 2) {
        // Case: "1:07.42" (Minutes : Seconds)
        const minutes = parseFloat(parts[0]);
        const seconds = parseFloat(parts[1]);
        
        totalSeconds = (minutes * 60) + seconds;
    } else {
        // Case: "33.14" (Seconds only)
        totalSeconds = parseFloat(parts[0]);
    }

    // 2. Convert to milliseconds
    // Math.round is used to fix floating point errors (e.g. 33.14 * 1000 might be 33139.999...)
    return Math.round(totalSeconds * 1000);
}

function parseLine(line: string, runningIndex: number): ISolve | null {
    const regex = /^"([^"]*)";"([^"]*)";"([^"]*)";"([^"]*)"$/;
    const match = line.match(regex);

    if (!match) {
        throw new Error('Line format did not match regex');
    }

    return {
        id: runningIndex,
        duration: convertToMs(match[1]), // TODO
        scramble: match[2],
        date: new Date(match[3]),
        uuid: INSERT_CONSTANTS.uuid,
        session: INSERT_CONSTANTS.session,
        discipline: INSERT_CONSTANTS.discipline,
        status: Status.Valid
    };
}

/**
 * Inserts the parsed data into the database.
 */
async function insertIntoDatabase(solve: ISolve) {
    // ADJUST THIS QUERY to match your actual table name and columns
    const queryText = `
        INSERT INTO solves 
        (uuid, discipline, duration, scramble, date, status, session)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id;
    `;

    const queryValues = [
        solve.uuid, solve.discipline, solve.duration, solve.scramble, solve.date, solve.status, solve.session
    ];

    try {
        const result = await pool.query(queryText, queryValues);
        // Optional: Log specific success
        // console.log(`Inserted solve ID: ${result.rows[0].id}`); 
    } catch (error) {
        console.error('Database Error:', error);
        throw error; // Re-throw to be caught by the main loop
    }
}

// Run the script
processLineByLine().catch(err => console.error(err));