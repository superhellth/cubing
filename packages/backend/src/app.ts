import cors from "cors";
import express from 'express';
import solveRoutes from './routes/solve.routes';

const app = express();
const port = 3000;

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'https://highpercube.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
// app.use(express.json());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Mount Routes
app.use('/api/db/solves', solveRoutes);

// Health Check
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});