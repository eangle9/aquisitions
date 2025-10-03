import { fetchAllUsers } from '#controllers/users.controller.js';
import { authenticationToken, requireRole } from '#middleware/auth.middleware.js';
import express from 'express';

const router = express.Router();

router.get('/', authenticationToken, requireRole(['admin']), fetchAllUsers);
router.get('/:id', (req, res, next) => res.send('GET /api/users/:id'));
router.patch('/:id', (req, res, next) => res.send('PATCH /api/users/:id'));
router.delete('/:id', (req, res, next) => res.send('DELETE /api/users/:id'));

export default router;
