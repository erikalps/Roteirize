import { Router, Request, Response } from 'express';
import { db } from '../config/db'
import { authenticate } from '../middlewares/authenticate';
import { validate } from '../middlewares/validate';
import { createTripSchema } from '../schemas/tripSchema';
import { isInvalidTextRepresentation } from '../utils/db-errors';



type TripRow = {
    id: string,
    user_id: string,
    title: string,
    destination: string,
    start_date: string,
    end_date: string,
    created_at: Date,
    updated_at: Date
}


function toTripResponse(trip: TripRow) {
    return {
        id: trip.id,
        userId: trip.user_id,
        title: trip.title,
        destination: trip.destination,
        startDate: trip.start_date,
        endDate: trip.end_date,
        createdAt: trip.created_at,
        updatedAt: trip.updated_at,
    }
}

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


            return res.status(201).json(toTripResponse(trip));


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

       const trips = result.rows.map(toTripResponse);

        return res.status(200).json(trips);




    } catch (error: unknown) {
        console.error('Erro ao listar viagens', error);
        return res.status(500).json({ error: 'Erro interno de servidor' })
    }

})

router.get('/:id', authenticate, async (req: Request, res: Response) => {
    const { id } = req.params;

    try {

        const result = await db.query(
            `SELECT id, user_id, title, destination, start_date, end_date, created_at, updated_at
            FROM  trips
            WHERE id = $1 AND user_id = $2`,
            [id, req.userId]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Viagem não encontrada' })
        }

        const trip = result.rows[0];

        return res.status(200).json(toTripResponse(trip))

    } catch (error: unknown) {
        if(isInvalidTextRepresentation(error)){
            return res.status(404).json({ error: 'Viagem não encontrada' });
        }
        
         console.error('Erro ao buscar viagem:', error);
        return res.status(500).json({ error: 'Erro interno de servidor' });

    }
})




router.delete('/:id', authenticate, async(req:Request, res: Response) =>{
    const {id} = req.params;
    
    try {
        const result = await db.query(
            `DELETE FROM trips 
            WHERE id = $1 AND user_id = $2
            `,
            [id, req.userId]
        )

        if(result.rowCount === 0){
            return res.status(404).json({error: 'Viagem não encontrada'})
        }

        return res.status(204).end();

    } catch (error: unknown) {
        if(isInvalidTextRepresentation(error)){
            return res.status(404).json({error:'Viagem não encontrada'})
        }

        console.error('Erro ao excluir viagem', error);
        return res.status(500).json({error:'Erro interno do servidor'})
    }
}) 
export default router;

