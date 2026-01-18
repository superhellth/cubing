import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as SolveController from '../controllers/solve.controller';

const router = Router();

const updateLimit = rateLimit({
    windowMs: 1000,
    max: 5,
    message: { message: "Too many requests." },
    standardHeaders: true,
    legacyHeaders: false,
});


router.use(updateLimit);

// POSTs
router.post('/insert', SolveController.insertSolve);
router.post('/insertBulk', SolveController.insertSolvesBulk);
router.post('/updateStatus', SolveController.updateSolveStatus);
router.post('/delete', SolveController.deleteSolve);
router.post('/deleteBulk', SolveController.deleteSolvesBulk);

// GETs
router.get('/getAll', SolveController.getAllSolves);
router.get('/getByImportSource', SolveController.getSolvesByImportSource);
router.get('/getByDisciplineAndSession', SolveController.getSolvesByDisciplineAndSession);
router.get('/getDemoSolves', SolveController.getDemoSolves);

export default router;