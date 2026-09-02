import { Router, Request, Response } from 'express';
import { db } from '../config/db'
import { authenticate } from '../middlewares/authenticate';
import { validate } from '../middlewares/validate';
import { createTripSchema } from '../schemas/tripSchema';


const router = Router();

router.post('/', authenticate, validate(createTripSchema),
    async (req: Request, res: Response) => {
        const { title, destination, start_date, end_date } = req.body;

        try {

            const result = await db.query(
                `INSERT INTO trips (user_id, title, destination, start_date, end_date)
                 VALUES ($1, $2, $3, $4, $5)
                 RETURNING id, user_id, title, destination, start_date, end_date, created_at, updated_at
                `,
                [req.userId, title, destination, start_date, end_date]
            );

            const trip = result.rows[0];


            return res.status(201).json({
                id: trip.id,
                userId: trip.user_id,
                title: trip.title,
                destination: trip.destination,
                startDate: trip.start_date,
                endDate: trip.end_date,
                createdAt: trip.created_at,
                updatedAt: trip.updated_at,
            })


        } catch (error: unknown) {
            console.error('Erro ao criar viagem:', error);
            return res.status(500).json({ error: 'Erro interno de servidor' })
        }

    }



);

router.get('/', authenticate, async (req: Request, res: Response) => {
    try {
        const result = await db.query(
            `SELECT id, user_id, title, destination, start_date, end_date, created_at, updated_at
             FROM trips
             WHERE user_id = $1
             ORDER BY start_date
            `,
            [req.userId]
        );

        const trips = result.rows.map((trip) => ({
            id: trip.id,
            userId: trip.user_id,
            title: trip.title,
            destination: trip.destination,
            startDate: trip.start_date,
            endDate: trip.end_date,
            createdAt: trip.created_at,
            updatedAt: trip.updated_at

        }));

        return res.status(200).json(trips);




    } catch (error: unknown) {
        console.error('Erro ao listar viagens', error);
        return res.status(500).json({ error: 'Erro interno de servidor' })
    }

})


export default router;

