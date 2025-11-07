const express = require('express')
const axios = require('axios');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: 'hypercube',
    host: '87.106.28.195',
    database: 'hypercube',
    password: 'hyper',
    port: 5432,
});

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/db/users/create', async (req, res) => {
    try {
        const { username, creationDate } = req.body;

        const queryText = 'INSERT INTO users(username, created_at) VALUES($1, $2) RETURNING *';
        const queryValues = [username, creationDate];

        const result = await pool.query(queryText, queryValues);
        console.log(result);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching from third-party API:', error.message);
        res.status(500).json({ message: 'Failed to create user.' });
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})