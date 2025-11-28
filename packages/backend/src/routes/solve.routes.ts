import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as SolveController from '../controllers/solve.controller';

const router = Router();

const updateLimit = rateLimit({
    windowMs: 1000,
    max: 2,
    message: { message: "Too many requests." },
    standardHeaders: true,
    legacyHeaders: false,
});


router.use(updateLimit);

// POSTs
router.post('/insert', SolveController.insertSolve);
router.post('/updateStatus', SolveController.updateSolveStatus);
router.post('/delete', SolveController.deleteSolve);

// GETs
router.get('/getAll', SolveController.getAllSolves);
router.get('/getByDisciplineAndSession', SolveController.GetSolvesByDisciplineAndSession);

export default router;